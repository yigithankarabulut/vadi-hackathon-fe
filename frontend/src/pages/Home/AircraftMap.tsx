import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import travellingIcon from '../../assets/travelling.png';
import type { Aircraft, AircraftMapProps } from '../../types';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export function AircraftMap({ aircrafts, onAircraftClick }: AircraftMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const routesRef = useRef<Map<string, L.Polyline>>(new Map());
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([39.9334, 32.8597], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    var planeIcon = L.icon({
      iconUrl: travellingIcon,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
    
    var planeMarker = L.marker([39.9334, 32.8597], { icon: planeIcon }).addTo(map);

    let lat = 39.9334;
    let lon = 32.8597;

    setInterval(() => {
      lat += 0.001;
      lon += 0.001;
      planeMarker.setLatLng([lat, lon]);
    }, 1000);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const createAircraftIcon = (status: string) => {
      return L.icon({
        iconUrl: travellingIcon,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });
    };
    const currentAircraftIds = new Set(aircrafts.map(a => a.id));
    markersRef.current.forEach((marker, id) => {
      if (!currentAircraftIds.has(id)) {
        map.removeLayer(marker);
        markersRef.current.delete(id);
      }
    });

    routesRef.current.forEach((route, id) => {
      if (!currentAircraftIds.has(id)) {
        map.removeLayer(route);
        routesRef.current.delete(id);
      }
    });

    aircrafts.forEach((aircraft) => {
      let marker = markersRef.current.get(aircraft.id);
      
      if (marker) {
        marker.setLatLng(aircraft.position);
        marker.setIcon(createAircraftIcon(aircraft.status));
      } else {
        marker = L.marker(aircraft.position, {
          icon: createAircraftIcon(aircraft.status),
        });

        const popupContent = `
          <div style="padding: 8px; min-width: 200px;">
            <div style="font-weight: 600; margin-bottom: 8px;">${aircraft.name}</div>
            <div style="font-size: 14px; color: #666;">
              <div style="margin-bottom: 4px;">Yükseklik: ${aircraft.altitude} ft</div>
              <div style="margin-bottom: 4px;">Hız: ${aircraft.speed} kt</div>
              <div>Durum: ${aircraft.status === 'active' ? 'Aktif' : aircraft.status === 'warning' ? 'Uyarı' : 'İnaktif'}</div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          onAircraftClick?.(aircraft);
        });
        marker.addTo(map);
        markersRef.current.set(aircraft.id, marker);
      }

      if (aircraft.route && aircraft.route.length > 0) {
        let route = routesRef.current.get(aircraft.id);
        const routeColor = aircraft.status === 'active' ? '#10b981' : '#ef4444';

        if (route) {
          route.setLatLngs(aircraft.route);
          route.setStyle({ color: routeColor });
        } else {
          route = L.polyline(aircraft.route, {
            color: routeColor,
            weight: 2,
            opacity: 0.6,
            dashArray: '5, 10',
          });
          route.addTo(map);
          routesRef.current.set(aircraft.id, route);
        }
      } else {
        const route = routesRef.current.get(aircraft.id);
        if (route) {
          map.removeLayer(route);
          routesRef.current.delete(aircraft.id);
        }
      }
    });
  }, [aircrafts, onAircraftClick]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    />
  );
}
