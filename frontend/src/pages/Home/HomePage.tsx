import { useState, useEffect } from 'react';
import { AircraftMap } from './AircraftMap';
import { AircraftList } from './AircraftList';
import { AlertPanel } from './AlertPanel';
import { StatsPanel } from './StatsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Plane } from 'lucide-react';
import type { Aircraft, AlertItem } from '../../types';

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
  },
  {
    id: 'AC-005',
    name: 'Corendon Airlines XC7890',
    position: [37.0000, 35.3213],
    altitude: 0,
    speed: 0,
    status: 'inactive',
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
            return {
              ...aircraft,
              position: [newLat, newLng] as [number, number],
              altitude: aircraft.altitude + (Math.random() - 0.5) * 100,
              speed: aircraft.speed + (Math.random() - 0.5) * 5,
            };
          }
          return aircraft;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: aircrafts.length,
    active: aircrafts.filter((a) => a.status === 'active').length,
    warning: aircrafts.filter((a) => a.status === 'warning').length,
    inactive: aircrafts.filter((a) => a.status === 'inactive').length,
  };

  return (
    <div className="min-h-screen bg-[#FFFCEF]">
      <header className="bg-white border-b border-[#659EB3]/20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#659EB3] p-2 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl text-[#659EB3] font-bold">IoT Canlı Filo Takip ve Uyarı Sistemi</h1>
              <p className="text-sm text-[#8B7B8E]">Gerçek zamanlı uçak izleme ve durum yönetimi</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <StatsPanel
            totalAircraft={stats.total}
            activeAircraft={stats.active}
            warningAircraft={stats.warning}
            inactiveAircraft={stats.inactive}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#659EB3]">Uçak Listesi</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                <AircraftList
                  aircrafts={aircrafts}
                  selectedAircraft={selectedAircraft}
                  onSelect={setSelectedAircraft}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#659EB3]">Canlı Harita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] rounded-lg overflow-hidden">
                  <AircraftMap
                    aircrafts={aircrafts}
                    onAircraftClick={setSelectedAircraft}
                  />
                </div>
              </CardContent>
            </Card>

            <AlertPanel alerts={alerts} />
          </div>
        </div>

        {selectedAircraft && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#659EB3]">Seçili Uçak Detayları - {selectedAircraft.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-[#8B7B8E]">Araç No</p>
                    <p className="text-lg font-bold text-[#659EB3]">{selectedAircraft.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B7B8E]">Yükseklik</p>
                    <p className="text-lg font-bold text-[#659EB3]">{selectedAircraft.altitude} ft</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B7B8E]">Hız</p>
                    <p className="text-lg font-bold text-[#659EB3]">{selectedAircraft.speed} kt</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B7B8E]">Konum</p>
                    <p className="text-sm font-medium text-[#659EB3]">
                      {selectedAircraft.position[0].toFixed(4)}, {selectedAircraft.position[1].toFixed(4)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
