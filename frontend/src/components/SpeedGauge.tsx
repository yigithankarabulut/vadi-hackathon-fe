import React from 'react';

interface SpeedGaugeProps {
  speed: number;
  maxSpeed?: number;
}

export const SpeedGauge: React.FC<SpeedGaugeProps> = ({ speed, maxSpeed = 1000 }) => {
  const percentage = Math.min((speed / maxSpeed) * 100, 100);
  const angle = (percentage / 100) * 180 - 90;

  const getSpeedColor = () => {
    if (percentage < 50) return '#659EB3';
    if (percentage < 80) return '#8B7B8E';
    return '#ef4444';
  };

  return (
    <div className="flex flex-col items-center gap-2" role="img" aria-label={`Hız göstergesi: ${speed} km/s`}>
      <div className="relative w-32 h-16">
        {}
        <svg className="w-full h-full overflow-visible" viewBox="0 0 200 100">
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {}
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke={getSpeedColor()}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
          {}
          <line
            x1="100"
            y1="80"
            x2="100"
            y2="20"
            stroke="#1f2937"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle} 100 80)`}
            style={{ transition: 'transform 0.5s ease' }}
          />
          {}
          <circle cx="100" cy="80" r="6" fill="#1f2937" />
        </svg>
        
        {}
        <div className="absolute bottom-0 left-0 text-xs text-gray-500" aria-hidden="true">0</div>
        <div className="absolute bottom-0 right-0 text-xs text-gray-500" aria-hidden="true">{maxSpeed}</div>
      </div>
      
      {}
      <div className="text-center">
        <div className="text-xl font-bold" style={{ color: getSpeedColor() }}>
          {speed.toFixed(0)}
        </div>
        <div className="text-xs text-gray-600">km/s</div>
      </div>
    </div>
  );
};
