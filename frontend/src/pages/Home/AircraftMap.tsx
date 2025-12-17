import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import travellingIcon from '../../assets/travelling.png';
import type { AircraftMapProps } from '../../types';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export function AircraftMap({ aircrafts, onAircraftClick }: AircraftMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      keyboard: true,
      keyboardPanDelta: 80,
    }).setView([39.9334, 32.8597], 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    var planeIcon = L.icon({
      iconUrl: travellingIcon,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
    
    aircrafts.forEach((aircraft) => {
       var planeMarker = L.marker([aircraft.position[0], aircraft.position[1]], { icon: planeIcon }).addTo(map);
       planeMarker.on('click', () => {
        onAircraftClick?.(aircraft);
      });
       setInterval(() => {
          const newLat = aircraft.position[0] + (Math.random() - 0.5) * 0.01;
          const newLng = aircraft.position[1] + (Math.random() - 0.5) * 0.01;
          planeMarker.setLatLng([newLat, newLng]);
        }, 1000);
      });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
      role="application"
      aria-label="Uçak konumlarını gösteren interaktif harita. Klavye ile hareket için ok tuşlarını kullanın."
      tabIndex={0}
    />
  );
}
