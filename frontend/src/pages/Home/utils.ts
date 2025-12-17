import type { Aircraft, AlertItem } from '../../types';

const generateInitialTimeSeriesData = (baseValue: number, count: number = 60) => {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => ({
    timestamp: now - (count - i) * 1000,
    value: baseValue + (Math.random() - 0.5) * baseValue * 0.1,
  }));
};



export const generateMockAircrafts = (): Aircraft[] => [
  {
    id: 'AC-001',
    name: 'Turkish Airlines TK1234',
    position: [39.9334, 32.8597],
    altitude: 35000,
    speed: 450,
    status: 'active',
    route: [
      [39.9334, 32.8597],
      [40.2, 33.5],
      [40.5, 34.2],
    ],
    motorTemp: 78,
    externalTemp: 28,
    speedHistory: generateInitialTimeSeriesData(450),
    altitudeHistory: generateInitialTimeSeriesData(35000),
  },
  
  {
    id: 'AC-002',
    name: 'Pegasus Airlines PC5678',
    position: [41.0082, 28.9784],
    altitude: 28000,
    speed: 420,
    status: 'active',
    route: [
      [41.0082, 28.9784],
      [40.5, 30.0],
      [40.0, 31.0],
    ],
    motorTemp: 72,
    externalTemp: 26,
    speedHistory: generateInitialTimeSeriesData(420),
    altitudeHistory: generateInitialTimeSeriesData(28000),
  },
  {
    id: 'AC-003',
    name: 'SunExpress XQ9012',
    position: [38.4237, 27.1428],
    altitude: 15000,
    speed: 380,
    status: 'warning',
    route: [
      [38.4237, 27.1428],
      [38.8, 28.0],
    ],
    motorTemp: 95,
    externalTemp: 32,
    speedHistory: generateInitialTimeSeriesData(380),
    altitudeHistory: generateInitialTimeSeriesData(15000),
  },
  {
    id: 'AC-004',
    name: 'AnadoluJet AJ3456',
    position: [36.8969, 30.7133],
    altitude: 32000,
    speed: 445,
    status: 'active',
    route: [
      [36.8969, 30.7133],
      [37.5, 31.5],
      [38.0, 32.0],
    ],
    motorTemp: 80,
    externalTemp: 29,
    speedHistory: generateInitialTimeSeriesData(445),
    altitudeHistory: generateInitialTimeSeriesData(32000),
  },
  {
    id: 'AC-005',
    name: 'Corendon Airlines XC7890',
    position: [37.0000, 35.3213],
    altitude: 0,
    speed: 0,
    status: 'inactive',
    motorTemp: 45,
    externalTemp: 22,
    speedHistory: generateInitialTimeSeriesData(0),
    altitudeHistory: generateInitialTimeSeriesData(0),
  },
  {
    id: 'AC-006',
    name: 'Turkish Airlines TK2468',
    position: [40.9769, 29.3611],
    altitude: 38000,
    speed: 465,
    status: 'active',
    route: [
      [40.9769, 29.3611],
      [41.2, 30.5],
      [41.5, 31.8],
    ],
    motorTemp: 76,
    externalTemp: 27,
    speedHistory: generateInitialTimeSeriesData(465),
    altitudeHistory: generateInitialTimeSeriesData(38000),
  },
];

export const generateMockAlerts = (): AlertItem[] => [
  {
    id: 'alert-1',
    aircraftId: 'AC-003',
    aircraftName: 'SunExpress XQ9012',
    type: 'warning',
    message: 'Düşük yakıt seviyesi algılandı. En yakın havaalanına yönlendirme öneriliyor.',
    timestamp: new Date(Date.now() - 5 * 60000),
  },
  {
    id: 'alert-2',
    aircraftId: 'AC-005',
    aircraftName: 'Corendon Airlines XC7890',
    type: 'error',
    message: 'İletişim kaybı. Son bilinen konum kaydedildi.',
    timestamp: new Date(Date.now() - 15 * 60000),
  },
  {
    id: 'alert-3',
    aircraftId: 'AC-001',
    aircraftName: 'Turkish Airlines TK1234',
    type: 'success',
    message: 'Rutin bakım tamamlandı. Uçuş hazırlıkları başlatıldı.',
    timestamp: new Date(Date.now() - 30 * 60000),
  },
];