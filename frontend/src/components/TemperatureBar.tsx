import React from 'react';

interface TemperatureBarProps {
  motorTemp: number;
  externalTemp: number;
  motorThreshold?: number;
  externalThreshold?: number;
}

export const TemperatureBar: React.FC<TemperatureBarProps> = ({
  motorTemp,
  externalTemp,
  motorThreshold = 90,
  externalThreshold = 40,
}) => {
  const getMotorColor = () => {
    if (motorTemp >= motorThreshold) return '#ef4444';
    if (motorTemp >= motorThreshold * 0.8) return '#f59e0b';
    return '#659EB3';
  };

  const getExternalColor = () => {
    if (externalTemp >= externalThreshold) return '#ef4444';
    if (externalTemp >= externalThreshold * 0.8) return '#f59e0b';
    return '#8B7B8E';
  };

  const motorPercentage = Math.min((motorTemp / 120) * 100, 100);
  const externalPercentage = Math.min((externalTemp / 60) * 100, 100);

  return (
    <div className="space-y-3" role="region" aria-label="Sıcaklık göstergeleri">
      {}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-semibold text-gray-700">Motor Sıcaklığı</h4>
          <span 
            className="text-sm font-bold"
            style={{ color: getMotorColor() }}
            role="status"
            aria-live="polite"
          >
            {motorTemp.toFixed(1)}°C
          </span>
        </div>
        
        <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
          <div
            className="absolute left-0 h-full transition-all duration-500"
            style={{
              width: `${motorPercentage}%`,
              backgroundColor: getMotorColor(),
            }}
            aria-hidden="true"
          />
          
          {}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gray-700"
            style={{ left: `${(motorThreshold / 120) * 100}%` }}
            aria-hidden="true"
          >
            <div className="absolute -top-1 -left-2 text-xs text-gray-700 font-semibold">
              ⚠️
            </div>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span aria-hidden="true">0°C</span>
          <span aria-hidden="true">Eşik: {motorThreshold}°C</span>
          <span aria-hidden="true">120°C</span>
        </div>
      </div>

      {}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-semibold text-gray-700">Dış Sıcaklık</h4>
          <span 
            className="text-sm font-bold" 
            style={{ color: getExternalColor() }}
            role="status"
            aria-live="polite"
          >
            {externalTemp.toFixed(1)}°C
          </span>
        </div>
        
        <div className="relative h-6 bg-gray-200 rounded-lg overflow-hidden">
          <div
            className="absolute left-0 h-full transition-all duration-500"
            style={{
              width: `${externalPercentage}%`,
              backgroundColor: getExternalColor(),
            }}
            aria-hidden="true"
          />
          
          {}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gray-700"
            style={{ left: `${(externalThreshold / 60) * 100}%` }}
            aria-hidden="true"
          >
            <div className="absolute -top-1 -left-2 text-xs text-gray-700 font-semibold">
              ⚠️
            </div>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span aria-hidden="true">0°C</span>
          <span aria-hidden="true">Eşik: {externalThreshold}°C</span>
          <span aria-hidden="true">60°C</span>
        </div>
      </div>
    </div>
  );
};
