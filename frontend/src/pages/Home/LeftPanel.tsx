import { useState } from 'react';
import type { Aircraft } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { AircraftList } from './AircraftList';
import { X, Plane, Search } from 'lucide-react';


export interface LeftPanelProps {
  aircrafts: Aircraft[];
  onAircraftClick?: (aircraft: Aircraft) => void;
  onClose?: () => void;
}

export function LeftPanel({ aircrafts, onAircraftClick, onClose }: LeftPanelProps) {
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAircraftSelect = (aircraft: Aircraft) => {
    setSelectedAircraft(aircraft);
    onAircraftClick?.(aircraft);
  };

  const filteredAircrafts = aircrafts.filter(aircraft =>
    aircraft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    aircraft.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = aircrafts.filter(a => a.status === 'active').length;
  const warningCount = aircrafts.filter(a => a.status === 'warning').length;

  return (
    <section className="xl:col-span-3 relative h-full" aria-labelledby="aircraft-list-title">
      {}
      <button
        onClick={onClose}
        className="hidden xl:flex absolute -right-10 top-4 bg-gradient-to-br from-[#659EB3] to-[#5088a3] hover:from-[#5088a3] hover:to-[#3f7a94] text-white p-2.5 rounded-r-xl transition-all duration-300 items-center justify-center z-50 shadow-lg hover:shadow-2xl hover:scale-110"
        aria-label="Sol paneli kapat"
        title="Paneli Kapat"
      >
        <X className="w-5 h-5" />
      </button>
      
      {}
      <button
        onClick={onClose}
        className="xl:hidden absolute right-2 top-2 z-10 bg-[#659EB3] hover:bg-[#5088a3] text-white p-2 rounded-full transition-all duration-200 flex items-center justify-center shadow-lg"
        aria-label="Paneli kapat"
      >
        <X className="w-4 h-4" />
      </button>
      
      <Card className="h-full flex flex-col shadow-2xl border-0 bg-gradient-to-b from-white to-[#FFFCEF] rounded-2xl overflow-hidden">
        {}
        <CardHeader className="pb-4 border-b-2 border-[#659EB3]/15 bg-gradient-to-r from-[#659EB3]/8 via-transparent to-[#8B7B8E]/8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-[#659EB3] to-[#5088a3] rounded-xl shadow-md transform transition-transform hover:scale-110">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle id="aircraft-list-title" className="text-[#659EB3] text-lg font-bold">
                Uçak Listesi
              </CardTitle>
              <div className="flex gap-2 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-200 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  {activeCount} Aktif
                </span>
                {warningCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 rounded-full text-xs font-semibold border border-yellow-200 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    {warningCount} Uyarı
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#659EB3]/40 group-focus-within:text-[#659EB3]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Uçak adı veya ID ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-[#659EB3]/20 rounded-lg text-sm text-[#659EB3] placeholder-[#8B7B8E]/50 focus:outline-none focus:border-[#659EB3] focus:ring-2 focus:ring-[#659EB3]/30 transition-all duration-200 font-medium shadow-sm hover:border-[#659EB3]/40"
              aria-label="Uçak listesinde ara"
            />
          </div>
        </CardHeader>

        {}
        <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredAircrafts.length > 0 ? (
              <div className="p-3 space-y-2">
                <AircraftList
                  aircrafts={filteredAircrafts}
                  selectedAircraft={selectedAircraft}
                  onSelect={handleAircraftSelect}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-3 py-12">
                  <div className="p-3 bg-[#659EB3]/10 rounded-full w-fit mx-auto">
                    <Plane className="w-8 h-8 text-[#659EB3]/50" />
                  </div>
                  <p className="text-[#8B7B8E] text-sm font-semibold">Uçak bulunamadı</p>
                  <p className="text-[#8B7B8E]/60 text-xs">Arama kriterlerinizi kontrol edin</p>
                </div>
              </div>
            )}
          </div>

          {}
          <div className="border-t-2 border-[#659EB3]/15 bg-gradient-to-r from-[#659EB3]/8 via-transparent to-[#8B7B8E]/8 px-4 py-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-[#8B7B8E] text-xs">
                  <span className="font-bold text-[#659EB3]">{filteredAircrafts.length}</span>
                  <span className="text-[#8B7B8E]/70 mx-1">/</span>
                  <span className="text-[#8B7B8E]/70">{aircrafts.length}</span>
                </div>
                <span className="text-[#8B7B8E]/60 text-xs font-medium">uçak</span>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full border border-green-200/50">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[#8B7B8E] text-xs font-medium">Aktif</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 rounded-full border border-yellow-200/50">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-[#8B7B8E] text-xs font-medium">Uyarı</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, #f3f3f5, #FFFCEF);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #659EB3, #8B7B8E);
          border-radius: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 0 6px rgba(101, 158, 179, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #5088a3, #7a6b7d);
          box-shadow: 0 0 8px rgba(101, 158, 179, 0.5);
        }
      `}</style>
    </section>
  );
}