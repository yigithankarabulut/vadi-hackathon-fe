import { useState } from 'react';
import { AircraftMap } from './AircraftMap';
import { AlertPanel } from './AlertPanel';
import { StatsPanel } from './StatsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import type { Aircraft, AlertItem } from '../../types';
import { generateMockAlerts, generateMockAircrafts } from './utils';
import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';
import { Menu, LogOut, User, Plane, Bell, Settings } from 'lucide-react';

export default function HomePage() {
  const [aircrafts] = useState<Aircraft[]>(generateMockAircrafts());
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | undefined>();
  const [alerts] = useState<AlertItem[]>(generateMockAlerts());
  const [leftPanelOpen, setLeftPanelOpen] = useState<boolean>(false);
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  const handleLogout = () => {
    console.log('Logging out...');
    window.location.href = '/login';
  };

  const stats = {
    total: aircrafts.length,
    active: aircrafts.filter((a) => a.status === 'active').length,
    warning: aircrafts.filter((a) => a.status === 'warning').length,
    inactive: aircrafts.filter((a) => a.status === 'inactive').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFCEF] via-white to-[#F5F0E8]">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#659EB3]/10 shadow-xl transition-all duration-300">
        <div className="container mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#659EB3] via-[#5088a3] to-[#3f7a94] flex items-center justify-center shadow-lg group hover:shadow-2xl transition-all duration-300">
              <Plane className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-[#659EB3] to-[#5088a3] bg-clip-text text-transparent">
                AirTrack
              </h1>
              <p className="text-xs text-[#8B7B8E] font-medium">Hava Trafik Takip</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-green-700">{stats.active} Aktif</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-yellow-700">{stats.warning} Uyarı</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative p-2 rounded-lg bg-[#659EB3]/5 hover:bg-[#659EB3]/10 text-[#659EB3] transition-all duration-300 group">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            <button className="p-2 rounded-lg bg-[#659EB3]/5 hover:bg-[#659EB3]/10 text-[#659EB3] transition-all duration-300 group">
              <Settings className="w-5 h-5 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#659EB3]/10 to-[#8B7B8E]/5 hover:from-[#659EB3]/20 hover:to-[#8B7B8E]/10 text-[#659EB3] transition-all duration-300 border border-[#659EB3]/20 hover:border-[#659EB3]/40 group"
                aria-label="Kullanıcı menüsü"
              >
                <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline text-sm font-medium">Admin</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-[#659EB3]/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-4 border-b border-[#659EB3]/10 bg-gradient-to-r from-[#659EB3]/5 via-transparent to-[#8B7B8E]/5">
                    <p className="text-sm font-bold text-[#659EB3]">Admin User</p>
                    <p className="text-xs text-[#8B7B8E] mt-1.5">admin@airtrack.com</p>
                  </div>

                  <div className="p-2">
                    <button className="w-full px-3 py-2 text-left text-sm font-medium text-[#659EB3] hover:bg-[#659EB3]/10 rounded-lg transition-all duration-200 flex items-center gap-2 group mb-1">
                      <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      Ayarlar
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center gap-2 group"
                    >
                      <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {!leftPanelOpen && (
        <button
          onClick={() => setLeftPanelOpen(true)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#659EB3] to-[#5088a3] hover:from-[#5088a3] hover:to-[#3f7a94] text-white rounded-r-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl md:px-4 md:py-3 group"
          aria-label="Sol paneli aç"
          title="Uçak Listesi"
        >
          <Menu className="w-5 h-5 flex-shrink-0 group-hover:rotate-90 transition-transform duration-300" />
          <span className="hidden md:inline text-sm font-bold whitespace-nowrap group-hover:tracking-wide transition-all duration-300">Uçaklar</span>
        </button>
      )}

      {!rightPanelOpen && (
        <button
          onClick={() => setRightPanelOpen(true)}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 px-3 py-2 bg-gradient-to-l from-[#659EB3] to-[#5088a3] hover:from-[#5088a3] hover:to-[#3f7a94] text-white rounded-l-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl md:px-4 md:py-3 group"
          aria-label="Sağ paneli aç"
          title="Uçak Detayları"
        >
          <span className="hidden md:inline text-sm font-bold whitespace-nowrap group-hover:tracking-wide transition-all duration-300">Detaylar</span>
          <Menu className="w-5 h-5 flex-shrink-0 rotate-180 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      )}

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8" role="main">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#659EB3] to-[#5088a3]"></div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#659EB3] to-[#5088a3] bg-clip-text text-transparent">
              Hava Trafik Takip
            </h1>
          </div>
          <p className="text-[#8B7B8E] text-sm sm:text-base ml-4 font-medium">
            Gerçek zamanlı uçak izleme ve yönetimi sistemi
          </p>
        </div>

        <section className="mb-8" aria-label="İstatistikler">
          <StatsPanel
            totalAircraft={stats.total}
            activeAircraft={stats.active}
            warningAircraft={stats.warning}
            inactiveAircraft={stats.inactive}
          />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
          
          {leftPanelOpen && (
            <div className="xl:col-span-3 animate-slide-in-left">
              <LeftPanel
                aircrafts={aircrafts}
                onAircraftClick={setSelectedAircraft}
                onClose={() => setLeftPanelOpen(false)}
              />
            </div>
          )}

          {/* Center - Map */}
          <div
            className={`space-y-6 transition-all duration-300 ${
              leftPanelOpen && rightPanelOpen ? 'xl:col-span-6' :
              leftPanelOpen || rightPanelOpen ? 'xl:col-span-9' :
              'xl:col-span-12'
            }`}
          >
            {/* Map Card */}
            <section aria-labelledby="map-title" className="animate-fade-in">
              <Card className="shadow-2xl border-0 overflow-hidden h-fit hover:shadow-2xl transition-shadow duration-300 group">
                <CardHeader className="bg-gradient-to-r from-[#659EB3]/10 via-transparent to-[#8B7B8E]/5 border-b-2 border-[#659EB3]/10 pb-4">
                  <CardTitle id="map-title" className="text-[#659EB3] text-lg flex items-center gap-2 group-hover:text-[#5088a3] transition-colors duration-300">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span>Canlı Harita</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div
                    className="w-full rounded-b-lg overflow-hidden relative bg-gradient-to-br from-[#f5f3ff] to-[#fff9f0]"
                    style={{ height: 'clamp(300px, 60vh, 700px)' }}
                    role="img"
                    aria-label="Uçak konumlarını gösteren canlı harita"
                  >
                    <AircraftMap
                      aircrafts={aircrafts}
                      onAircraftClick={setSelectedAircraft}
                    />
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-xl text-xs sm:text-sm text-[#8B7B8E] font-bold border border-[#659EB3]/20 hover:border-[#659EB3]/40 transition-all duration-300">
                      ✈️ {aircrafts.length} Uçak
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Alerts */}
            <section aria-labelledby="alerts-title" className="animate-fade-in">
              <AlertPanel alerts={alerts} />
            </section>
          </div>

          {/* Right Panel */}
          {rightPanelOpen && (
            <div className="xl:col-span-3 animate-slide-in-right">
              <RightPanel
                selectedAircraft={selectedAircraft}
                onAircraftClick={(aircraft) => {
                  setSelectedAircraft(aircraft);
                  if (!aircraft) {
                    setRightPanelOpen(false);
                  }
                }}
                onClose={() => setRightPanelOpen(false)}
              />
            </div>
          )}

        </div>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.4s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}