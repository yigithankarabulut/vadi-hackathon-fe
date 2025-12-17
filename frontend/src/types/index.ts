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
  status: 'active' | 'inactive' | 'warning' | 'maintenance';
  route?: [number, number][];
  motorTemp?: number;
  externalTemp?: number;
  speedHistory?: TimeSeriesData[];
  altitudeHistory?: TimeSeriesData[];
  
  mac_address?: string;
  current_airport_id?: number;
  assigned_pilot_id?: number;
  assigned_pilot?: Pilot;
  current_airport?: Airport;
}

export interface Pilot {
  ID: number;
  id?: number;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
}

export interface Airport {
  id: number;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface FlightPlan {
  id: number;
  aircraft_id: number;
  team_id: number;
  departure_airport_id: number;
  arrival_airport_id: number;
  scheduled_departure_time: string;
  scheduled_arrival_time: string;
  actual_departure_time?: string;
  actual_arrival_time?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
 
  aircraft?: Aircraft;
  departure_airport?: Airport;
  arrival_airport?: Airport;
}

export interface Geofence {
  id: number;
  name: string;
  description: string;
  min_latitude: number;
  max_latitude: number;
  min_longitude: number;
  max_longitude: number;
  is_active: boolean;
  color?: string;
}

export interface Threshold {
  id: number;
  aircraft_id: number;
  metric_name: string;
  max_value: number;
  min_value: number;
  is_default: boolean;
}

export interface AISession {
  session_id: string;
  user_id: string;
  created_at: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AlertItem {
  id: string;
  aircraftId: string;
  aircraftName: string;
  type: 'warning' | 'error' | 'info' | 'success' | 'geofence';
  message: string;
  timestamp: Date;
  geofence?: Geofence;
  threshold?: Threshold;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface DashboardStats {
  totalAircraft: number;
  activeAircraft: number;
  warningAircraft: number;
  inactiveAircraft: number;
  totalFlightPlans: number;
  activeFlightPlans: number;
  totalPilots: number;
  activeGeofences: number;
}

export interface AircraftMapProps {
  aircrafts: Aircraft[];
  geofences?: Geofence[];
  flightPlans?: FlightPlan[];
  airports?: Airport[];
  onAircraftClick?: (aircraft: Aircraft) => void;
  onGeofenceClick?: (geofence: Geofence) => void;
}

export interface AircraftListProps {
  aircrafts: Aircraft[];
  selectedAircraft?: Aircraft;
  onSelect: (aircraft: Aircraft) => void;
}

export interface AlertPanelProps {
  alerts: AlertItem[];
  onAlertClick?: (alert: AlertItem) => void;
  onDismiss?: (alertId: string) => void;
}

export interface StatsPanelProps {
  totalAircraft: number;
  activeAircraft: number;
  warningAircraft: number;
  inactiveAircraft: number;
  totalFlightPlans?: number;
  activeFlightPlans?: number;
}

export interface FlightPlanPanelProps {
  flightPlans: FlightPlan[];
  selectedFlightPlan?: FlightPlan;
  onSelect?: (plan: FlightPlan) => void;
  onStatusChange?: (planId: number, status: FlightPlan['status']) => void;
}

export interface AIAssistantProps {
  onClose?: () => void;
  initialPrompt?: string;
}

export interface CreateFlightPlanForm {
  aircraft_id: number;
  team_id: number;
  departure_airport_id: number;
  arrival_airport_id: number;
  scheduled_departure_time: string;
  scheduled_arrival_time: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
}

export interface CreateGeofenceForm {
  name: string;
  description: string;
  min_latitude: number;
  max_latitude: number;
  min_longitude: number;
  max_longitude: number;
  is_active: boolean;
}

export interface CreateThresholdForm {
  aircraft_id: number;
  metric_name: string;
  max_value: number;
  min_value: number;
  is_default: boolean;
}
