import { Card, CardContent } from '../../ui/card';
import { Plane, Radio, AlertCircle, Activity } from 'lucide-react';
import type { StatsPanelProps } from '../../types';

export function StatsPanel({
  totalAircraft,
  activeAircraft,
  warningAircraft,
  inactiveAircraft,
}: StatsPanelProps) {
  const stats = [
    {
      title: 'Toplam Uçak',
      value: totalAircraft,
      icon: Plane,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Aktif',
      value: activeAircraft,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Uyarı',
      value: warningAircraft,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'İnaktif',
      value: inactiveAircraft,
      icon: Radio,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-3xl mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
