export interface TimeSeriesData {
  timestamp: number;
  value: number;
}

export interface Aircraft {
  id: string;
  name: string;
  position: [number, number];
  altitude: number;
  speed: number;
  status: 'active' | 'inactive' | 'warning';
  route?: [number, number][];
  motorTemp?: number;
  externalTemp?: number;
  speedHistory?: TimeSeriesData[];
  altitudeHistory?: TimeSeriesData[];
}

export interface AlertItem {
  id: string;
  aircraftId: string;
  aircraftName: string;
  type: 'warning' | 'error' | 'info' | 'success';
  message: string;
  timestamp: Date;
}

// Props interfaces
export interface AircraftMapProps {
  aircrafts: Aircraft[];
  onAircraftClick?: (aircraft: Aircraft) => void;
}

export interface AircraftListProps {
  aircrafts: Aircraft[];
  selectedAircraft?: Aircraft;
  onSelect: (aircraft: Aircraft) => void;
}

export interface AlertPanelProps {
  alerts: AlertItem[];
}

export interface StatsPanelProps {
  totalAircraft: number;
  activeAircraft: number;
  warningAircraft: number;
  inactiveAircraft: number;
}
