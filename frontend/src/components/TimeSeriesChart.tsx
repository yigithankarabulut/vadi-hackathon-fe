import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TimeSeriesData } from '../types';

interface TimeSeriesChartProps {
  speedHistory?: TimeSeriesData[];
  altitudeHistory?: TimeSeriesData[];
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  speedHistory = [],
  altitudeHistory = [],
}) => {
  const chartData = speedHistory.map((speed, index) => ({
    timestamp: new Date(speed.timestamp).toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    }),
    speed: speed.value,
    altitude: altitudeHistory[index]?.value || 0,
  }));

  const displayData = chartData.slice(-60);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-2 border-[#659EB3] rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)} {entry.dataKey === 'speed' ? 'km/s' : 'm'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="w-full"
      role="img"
      aria-label="Son 1 dakikanın hız ve yükseklik grafiği"
    >
      <h3 className="text-sm font-semibold text-gray-800 mb-2">
        Zaman Serisi (Son 1 Dakika)
      </h3>
      
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={displayData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="timestamp" 
            stroke="#6b7280"
            style={{ fontSize: '9px' }}
            interval="preserveEnd"
            tick={{ fontSize: 9 }}
          />
          <YAxis 
            yAxisId="left"
            stroke="#659EB3"
            style={{ fontSize: '9px' }}
            width={35}
            tick={{ fontSize: 9 }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#8B7B8E"
            style={{ fontSize: '9px' }}
            width={35}
            tick={{ fontSize: 9 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '10px' }}
            iconType="line"
            iconSize={8}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="speed"
            stroke="#659EB3"
            strokeWidth={2}
            dot={false}
            name="Hız"
            isAnimationActive={true}
            animationDuration={300}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="altitude"
            stroke="#8B7B8E"
            strokeWidth={2}
            dot={false}
            name="Yükseklik"
            isAnimationActive={true}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
