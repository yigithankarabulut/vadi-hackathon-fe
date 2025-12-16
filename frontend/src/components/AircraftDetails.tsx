import React from 'react';
import type { Aircraft } from '../types';
import { SpeedGauge } from './SpeedGauge';
import { AltitudeBar } from './AltitudeBar';
import { TemperatureBar } from './TemperatureBar';
import { TimeSeriesChart } from './TimeSeriesChart';
import { X } from 'lucide-react';

interface AircraftDetailsProps {
  aircraft: Aircraft;
  onClose?: () => void;
}

export function AircraftDetails({ aircraft, onClose }: AircraftDetailsProps) {
  return (
    <div 
      className="space-y-3 h-full overflow-y-auto"
      role="complementary"
      aria-labelledby="aircraft-details-title"
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-2 bg-white p-3 rounded-lg shadow-sm">
        <div className="min-w-0 flex-1">
          <h2 
            id="aircraft-details-title"
            className="text-base font-bold text-gray-800 truncate"
          >
            {aircraft.name}
          </h2>
          <p className="text-xs text-gray-600">ID: {aircraft.id}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
            aria-label="Detayları kapat"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 gap-3">
        {/* Speed Gauge */}
        <div className="bg-[#FFFCEF] p-3 rounded-lg shadow-sm">
          <SpeedGauge speed={aircraft.speed} />
        </div>

        {/* Altitude Bar */}
        <div className="bg-[#FFFCEF] p-3 rounded-lg shadow-sm">
          <AltitudeBar altitude={aircraft.altitude} />
        </div>

        {/* Temperature Bars */}
        <div className="bg-[#FFFCEF] p-3 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Sıcaklık</h3>
          <TemperatureBar
            motorTemp={aircraft.motorTemp || 75}
            externalTemp={aircraft.externalTemp || 25}
          />
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="bg-[#FFFCEF] p-3 rounded-lg shadow-sm">
        <TimeSeriesChart
          speedHistory={aircraft.speedHistory}
          altitudeHistory={aircraft.altitudeHistory}
        />
      </div>

      {/* Additional Info */}
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Ek Bilgiler</h3>
        <dl className="grid grid-cols-1 gap-2 text-xs">
          <div>
            <dt className="text-xs font-medium text-gray-600">Durum</dt>
            <dd className="mt-0.5">
              <span
                className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                  aircraft.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : aircraft.status === 'warning'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {aircraft.status === 'active' ? 'Aktif' : aircraft.status === 'warning' ? 'Uyarı' : 'İnaktif'}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-600">Konum</dt>
            <dd className="mt-0.5 text-xs text-gray-800">
              {aircraft.position[0].toFixed(4)}, {aircraft.position[1].toFixed(4)}
            </dd>
          </div>
          {aircraft.route && aircraft.route.length > 0 && (
            <div>
              <dt className="text-xs font-medium text-gray-600">Rota Noktaları</dt>
              <dd className="mt-0.5 text-xs text-gray-800">
                {aircraft.route.length} nokta
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};
