import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Plane, Radio, AlertCircle } from 'lucide-react';
import type { Aircraft, AircraftListProps } from '../../types';

export function AircraftList({ aircrafts, selectedAircraft, onSelect }: AircraftListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Aktif</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Uyarı</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500">İnaktif</Badge>;
      default:
        return <Badge>Bilinmiyor</Badge>;
    }
  };

  return (
    <div className="space-y-3">
      {aircrafts.map((aircraft) => (
        <Card
          key={aircraft.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedAircraft?.id === aircraft.id ? 'border-blue-500 border-2' : ''
          }`}
          onClick={() => onSelect(aircraft)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1">
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
                    <h3 className="font-semibold">{aircraft.name}</h3>
                    {getStatusBadge(aircraft.status)}
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Araç No:</span>
                      <span className="font-medium">{aircraft.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Yükseklik:</span>
                      <span className="font-medium">{aircraft.altitude} ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hız:</span>
                      <span className="font-medium">{aircraft.speed} kt</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Konum:</span>
                      <span className="font-medium text-xs">
                        {aircraft.position[0].toFixed(4)}, {aircraft.position[1].toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
