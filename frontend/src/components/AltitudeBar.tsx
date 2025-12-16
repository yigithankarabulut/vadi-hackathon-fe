import React from 'react';

interface AltitudeBarProps {
  altitude: number;
  maxAltitude?: number;
}

export const AltitudeBar: React.FC<AltitudeBarProps> = ({ altitude, maxAltitude = 12000 }) => {
  const percentage = Math.min((altitude / maxAltitude) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-2" role="img" aria-label={`Yükseklik göstergesi: ${altitude} metre`}>
      <h3 className="text-sm font-semibold text-gray-800">Yükseklik</h3>
      
      <div className="flex items-end gap-2 h-40">
        {/* Vertical Bar */}
        <div className="relative w-12 h-full bg-gray-200 rounded-lg overflow-hidden">
          <div
            className="absolute bottom-0 w-full bg-gradient-to-t from-[#659EB3] to-[#8B7B8E] transition-all duration-500"
            style={{ height: `${percentage}%` }}
            aria-hidden="true"
          />
          
          {/* Scale Markers */}
          <div className="absolute inset-0 flex flex-col justify-between py-2">
            {[100, 75, 50, 25, 0].map((mark) => (
              <div key={mark} className="w-full border-t border-gray-300" aria-hidden="true" />
            ))}
          </div>
        </div>
        
        {/* Scale Labels */}
        <div className="flex flex-col justify-between h-full text-xs text-gray-600 py-2">
          <span aria-hidden="true">{maxAltitude}m</span>
          <span aria-hidden="true">{(maxAltitude * 0.75).toFixed(0)}m</span>
          <span aria-hidden="true">{(maxAltitude * 0.5).toFixed(0)}m</span>
          <span aria-hidden="true">{(maxAltitude * 0.25).toFixed(0)}m</span>
          <span aria-hidden="true">0m</span>
        </div>
      </div>
      
      {/* Current Value */}
      <div className="text-center">
        <div className="text-xl font-bold text-[#659EB3]">
          {altitude.toFixed(0)}
        </div>
        <div className="text-xs text-gray-600">metre</div>
      </div>
    </div>
  );
};
