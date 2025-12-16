import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Plane, Radio, AlertCircle } from 'lucide-react';
import type { AircraftListProps } from '../../types';

export function AircraftList({ aircrafts, selectedAircraft, onSelect }: AircraftListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500" aria-label="Durum: Aktif">Aktif</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500" aria-label="Durum: Uyarı">Uyarı</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500" aria-label="Durum: İnaktif">İnaktif</Badge>;
      default:
        return <Badge aria-label="Durum: Bilinmiyor">Bilinmiyor</Badge>;
    }
  };

  return (
    <nav className="space-y-3" aria-label="Uçak listesi" role="list">
      {aircrafts.map((aircraft) => (
        <Card
          key={aircraft.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedAircraft?.id === aircraft.id ? 'border-[#659EB3] border-2' : ''
          }`}
          onClick={() => onSelect(aircraft)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(aircraft);
            }
          }}
          aria-label={`${aircraft.name}, ${aircraft.status === 'active' ? 'Aktif' : aircraft.status === 'warning' ? 'Uyarı' : 'İnaktif'}`}
          aria-pressed={selectedAircraft?.id === aircraft.id}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1" aria-hidden="true">
                  {aircraft.status === 'active' ? (
                    <Plane className="h-5 w-5 text-green-500" />
                  ) : aircraft.status === 'warning' ? (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Radio className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#659EB3]">{aircraft.name}</h3>
                    {getStatusBadge(aircraft.status)}
                  </div>
                  <dl className="mt-2 space-y-1 text-sm text-[#8B7B8E]">
                    <div className="flex justify-between">
                      <dt>Araç No:</dt>
                      <dd className="font-medium text-[#659EB3]">{aircraft.id}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Yükseklik:</dt>
                      <dd className="font-medium text-[#659EB3]">
                        <span aria-label={`${aircraft.altitude} feet`}>{aircraft.altitude} ft</span>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Hız:</dt>
                      <dd className="font-medium text-[#659EB3]">
                        <span aria-label={`${aircraft.speed} knot`}>{aircraft.speed} kt</span>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Konum:</dt>
                      <dd className="font-medium text-xs text-[#659EB3]">
                        <span aria-label={`Enlem ${aircraft.position[0].toFixed(4)}, Boylam ${aircraft.position[1].toFixed(4)}`}>
                          {aircraft.position[0].toFixed(4)}, {aircraft.position[1].toFixed(4)}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </nav>
  );
}
