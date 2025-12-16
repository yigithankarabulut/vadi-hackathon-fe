import { useState, useEffect } from 'react';
import { AircraftMap } from './AircraftMap';
import { AircraftList } from './AircraftList';
import { AlertPanel } from './AlertPanel';
import { StatsPanel } from './StatsPanel';
import { AircraftDetails } from '../../components/AircraftDetails';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Plane } from 'lucide-react';
import type { Aircraft, AlertItem } from '../../types';

const generateInitialTimeSeriesData = (baseValue: number, count: number = 60) => {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => ({
    timestamp: now - (count - i) * 1000,
    value: baseValue + (Math.random() - 0.5) * baseValue * 0.1,
  }));
};

const generateMockAircrafts = (): Aircraft[] => [
  {
    id: 'AC-001',
    name: 'Turkish Airlines TK1234',
    position: [39.9334, 32.8597],
    altitude: 35000,
    speed: 450,
    status: 'active',
    route: [
      [39.9334, 32.8597],
      [40.2, 33.5],
      [40.5, 34.2],
    ],
    motorTemp: 78,
    externalTemp: 28,
    speedHistory: generateInitialTimeSeriesData(450),
    altitudeHistory: generateInitialTimeSeriesData(35000),
  },
  {
    id: 'AC-002',
    name: 'Pegasus Airlines PC5678',
    position: [41.0082, 28.9784],
    altitude: 28000,
    speed: 420,
    status: 'active',
    route: [
      [41.0082, 28.9784],
      [40.5, 30.0],
      [40.0, 31.0],
    ],
    motorTemp: 72,
    externalTemp: 26,
    speedHistory: generateInitialTimeSeriesData(420),
    altitudeHistory: generateInitialTimeSeriesData(28000),
  },
  {
    id: 'AC-003',
    name: 'SunExpress XQ9012',
    position: [38.4237, 27.1428],
    altitude: 15000,
    speed: 380,
    status: 'warning',
    route: [
      [38.4237, 27.1428],
      [38.8, 28.0],
    ],
    motorTemp: 95,
    externalTemp: 32,
    speedHistory: generateInitialTimeSeriesData(380),
    altitudeHistory: generateInitialTimeSeriesData(15000),
  },
  {
    id: 'AC-004',
    name: 'AnadoluJet AJ3456',
    position: [36.8969, 30.7133],
    altitude: 32000,
    speed: 445,
    status: 'active',
    route: [
      [36.8969, 30.7133],
      [37.5, 31.5],
      [38.0, 32.0],
    ],
    motorTemp: 80,
    externalTemp: 29,
    speedHistory: generateInitialTimeSeriesData(445),
    altitudeHistory: generateInitialTimeSeriesData(32000),
  },
  {
    id: 'AC-005',
    name: 'Corendon Airlines XC7890',
    position: [37.0000, 35.3213],
    altitude: 0,
    speed: 0,
    status: 'inactive',
    motorTemp: 45,
    externalTemp: 22,
    speedHistory: generateInitialTimeSeriesData(0),
    altitudeHistory: generateInitialTimeSeriesData(0),
  },
  {
    id: 'AC-006',
    name: 'Turkish Airlines TK2468',
    position: [40.9769, 29.3611],
    altitude: 38000,
    speed: 465,
    status: 'active',
    route: [
      [40.9769, 29.3611],
      [41.2, 30.5],
      [41.5, 31.8],
    ],
    motorTemp: 76,
    externalTemp: 27,
    speedHistory: generateInitialTimeSeriesData(465),
    altitudeHistory: generateInitialTimeSeriesData(38000),
  },
];

const generateMockAlerts = (): AlertItem[] => [
  {
    id: 'alert-1',
    aircraftId: 'AC-003',
    aircraftName: 'SunExpress XQ9012',
    type: 'warning',
    message: 'Düşük yakıt seviyesi algılandı. En yakın havaalanına yönlendirme öneriliyor.',
    timestamp: new Date(Date.now() - 5 * 60000),
  },
  {
    id: 'alert-2',
    aircraftId: 'AC-005',
    aircraftName: 'Corendon Airlines XC7890',
    type: 'error',
    message: 'İletişim kaybı. Son bilinen konum kaydedildi.',
    timestamp: new Date(Date.now() - 15 * 60000),
  },
  {
    id: 'alert-3',
    aircraftId: 'AC-001',
    aircraftName: 'Turkish Airlines TK1234',
    type: 'success',
    message: 'Rutin bakım tamamlandı. Uçuş hazırlıkları başlatıldı.',
    timestamp: new Date(Date.now() - 30 * 60000),
  },
];

export default function HomePage() {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>(generateMockAircrafts());
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | undefined>();
  const [alerts] = useState<AlertItem[]>(generateMockAlerts());

  useEffect(() => {
    const interval = setInterval(() => {
      setAircrafts((prevAircrafts) =>
        prevAircrafts.map((aircraft) => {
          if (aircraft.status === 'active' && aircraft.route && aircraft.route.length > 0) {
            const [lat, lng] = aircraft.position;
            const newLat = lat + (Math.random() - 0.5) * 0.01;
            const newLng = lng + (Math.random() - 0.5) * 0.01;
            const newAltitude = aircraft.altitude + (Math.random() - 0.5) * 100;
            const newSpeed = aircraft.speed + (Math.random() - 0.5) * 5;
            const newMotorTemp = (aircraft.motorTemp || 75) + (Math.random() - 0.5) * 2;
            const newExternalTemp = (aircraft.externalTemp || 25) + (Math.random() - 0.5) * 1;
            
            const newRoute = aircraft.route ? [...aircraft.route, [newLat, newLng] as [number, number]] : [[newLat, newLng] as [number, number]];
            const limitedRoute = newRoute.slice(-20);

            const now = Date.now();
            const speedHistory = [...(aircraft.speedHistory || []), { timestamp: now, value: newSpeed }].slice(-60);
            const altitudeHistory = [...(aircraft.altitudeHistory || []), { timestamp: now, value: newAltitude }].slice(-60);

            return {
              ...aircraft,
              position: [newLat, newLng] as [number, number],
              altitude: newAltitude,
              speed: newSpeed,
              motorTemp: newMotorTemp,
              externalTemp: newExternalTemp,
              route: limitedRoute,
              speedHistory,
              altitudeHistory,
            };
          }
          return aircraft;
        })
      );
      
      setSelectedAircraft((prev) => {
        if (!prev) return prev;
        const updated = aircrafts.find((a) => a.id === prev.id);
        return updated || prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [aircrafts]);

  const stats = {
    total: aircrafts.length,
    active: aircrafts.filter((a) => a.status === 'active').length,
    warning: aircrafts.filter((a) => a.status === 'warning').length,
    inactive: aircrafts.filter((a) => a.status === 'inactive').length,
  };

  return (
    <div className="min-h-screen bg-[#FFFCEF]">
      <header className="bg-white border-b border-[#659EB3]/20 shadow-sm" role="banner">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#659EB3] p-2 rounded-lg" aria-hidden="true">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl text-[#659EB3] font-bold">IoT Canlı Filo Takip ve Uyarı Sistemi</h1>
              <p className="text-sm text-[#8B7B8E]">Gerçek zamanlı uçak izleme ve durum yönetimi</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6" role="main">
        <section className="mb-6" aria-label="İstatistikler">
          <StatsPanel
            totalAircraft={stats.total}
            activeAircraft={stats.active}
            warningAircraft={stats.warning}
            inactiveAircraft={stats.inactive}
          />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <section className="xl:col-span-3" aria-labelledby="aircraft-list-title">
            <Card>
              <CardHeader>
                <CardTitle id="aircraft-list-title" className="text-[#659EB3]">Uçak Listesi</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                <AircraftList
                  aircrafts={aircrafts}
                  selectedAircraft={selectedAircraft}
                  onSelect={setSelectedAircraft}
                />
              </CardContent>
            </Card>
          </section>

          <div className="xl:col-span-5 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            <section aria-labelledby="map-title">
              <Card>
                <CardHeader>
                  <CardTitle id="map-title" className="text-[#659EB3]">Canlı Harita</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] rounded-lg overflow-hidden" role="img" aria-label="Uçak konumlarını gösteren canlı harita">
                    <AircraftMap
                      aircrafts={aircrafts}
                      onAircraftClick={setSelectedAircraft}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            <AlertPanel alerts={alerts} />
          </div>

          <div className="xl:col-span-4 max-h-[calc(100vh-200px)]">
            {selectedAircraft ? (
              <section aria-labelledby="selected-aircraft-title" role="region" aria-live="polite" className="h-full">
                <AircraftDetails
                  aircraft={selectedAircraft}
                  onClose={() => setSelectedAircraft(undefined)}
                />
              </section>
            ) : (
              <Card className="h-full flex items-center justify-center bg-white">
                <CardContent className="text-center text-gray-500 py-12">
                  <Plane className="w-16 h-16 mx-auto mb-4 text-[#659EB3] opacity-50" />
                  <p className="text-lg font-semibold">Uçak Seçilmedi</p>
                  <p className="text-sm mt-2">Detaylı bilgi görmek için haritadan veya listeden bir uçak seçin</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
