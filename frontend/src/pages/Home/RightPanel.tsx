import type { Aircraft } from '../../types';
import { Card, CardContent } from '../../ui/card';
import { AircraftDetails } from '../../components/AircraftDetails';
import { Plane, X } from 'lucide-react';


export interface RightPanelProps {
  selectedAircraft: Aircraft | undefined;
  onAircraftClick?: (aircraft: Aircraft | undefined) => void;
  onClose?: () => void;
}

export function RightPanel({ selectedAircraft, onAircraftClick, onClose }: RightPanelProps) {
  const handleClose = () => {
    onAircraftClick?.(undefined);
    onClose?.();
  };

  return (
    <div className="xl:col-span-4 max-h-[calc(100vh-200px)] relative">
      {}
      <button
        onClick={handleClose}
        className="absolute -left-10 top-0 bg-[#659EB3] hover:bg-[#5088a3] text-white p-2 rounded-l-lg transition-all duration-200 flex items-center justify-center"
        aria-label="Sağ paneli kapat"
        title="Paneli Kapat"
      >
        <X className="w-5 h-5" />
      </button>

      {selectedAircraft ? (
        <section aria-labelledby="selected-aircraft-title" role="region" aria-live="polite" className="h-full">
          <AircraftDetails
            aircraft={selectedAircraft}
            onClose={handleClose}
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
  );
}
