import { jwtDecode } from "jwt-decode";

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

interface MyJwtPayload {
    exp?: number;
    role: string;
    userId: string;
}

interface LoginResponse {
    accessToken: string;
    role: 'admin' | 'user';
    userId: string;
}

interface RegisterResponse {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}

interface UserResponse {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}

interface PilotResponse {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}

interface PilotUser {
    ID: number;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
}

interface UpdateUserRequest {
    email?: string;
    first_name?: string;
    last_name?: string;
    role?: string;
}

interface AircraftResponse {
    id: string;
    mac_address: string;
    name: string;
    current_airport_id: number;
    assigned_pilot_id: number;
    status: 'active' | 'inactive' | 'warning' | 'maintenance';
}

interface AircraftListParams {
    limit?: number;
    offset?: number;
    owner_id?: number;
    pilot_id?: number;
}

interface UpdateAircraftRequest {
    mac_address?: string;
    name?: string;
    current_airport_id?: number;
    status?: 'active' | 'inactive' | 'warning' | 'maintenance';
}

interface AirportResponse {
    id: number;
    name: string;
    code: string;
    latitude: number;
    longitude: number;
}

interface FlightPlanResponse {
    id: number;
    aircraft_id: number;
    team_id: number;
    departure_airport_id: number;
    arrival_airport_id: number;
    scheduled_departure_time: string;
    scheduled_arrival_time: string;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
}

interface CreateFlightPlanRequest {
    aircraft_id: number;
    team_id: number;
    departure_airport_id: number;
    arrival_airport_id: number;
    scheduled_departure_time: string;
    scheduled_arrival_time: string;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
}

interface UpdateFlightPlanRequest {
    aircraft_id?: number;
    team_id?: number;
    departure_airport_id?: number;
    arrival_airport_id?: number;
    scheduled_departure_time?: string;
    scheduled_arrival_time?: string;
    status?: 'planned' | 'in_progress' | 'completed' | 'cancelled';
}

interface FlightPlanListParams {
    limit?: number;
    offset?: number;
    aircraft_id?: number;
    status?: string;
}

interface GeofenceResponse {
    id: number;
    name: string;
    description: string;
    min_latitude: number;
    max_latitude: number;
    min_longitude: number;
    max_longitude: number;
    is_active: boolean;
}

interface CreateGeofenceRequest {
    name: string;
    description: string;
    min_latitude: number;
    max_latitude: number;
    min_longitude: number;
    max_longitude: number;
    is_active: boolean;
}

interface UpdateGeofenceRequest {
    name?: string;
    description?: string;
    min_latitude?: number;
    max_latitude?: number;
    min_longitude?: number;
    max_longitude?: number;
    is_active?: boolean;
}

interface ThresholdResponse {
    id: number;
    aircraft_id: number;
    metric_name: string;
    max_value: number;
    min_value: number;
    is_default: boolean;
}

interface CreateThresholdRequest {
    aircraft_id: number;
    metric_name: string;
    max_value: number;
    min_value: number;
    is_default: boolean;
}

interface UpdateThresholdRequest {
    aircraft_id?: number;
    metric_name?: string;
    max_value?: number;
    min_value?: number;
    is_default?: boolean;
}

interface AISessionResponse {
    session_id: string;
    user_id: string;
    created_at: string;
}

interface AIPromptResponse {
    response: string;
    session_id: string;
}

export type {
    ApiResponse,
    LoginResponse,
    RegisterResponse,
    UserResponse,
    PilotResponse,
    PilotUser,
    UpdateUserRequest,
    AircraftResponse,
    AircraftListParams,
    UpdateAircraftRequest,
    AirportResponse,
    FlightPlanResponse,
    CreateFlightPlanRequest,
    UpdateFlightPlanRequest,
    FlightPlanListParams,
    GeofenceResponse,
    CreateGeofenceRequest,
    UpdateGeofenceRequest,
    ThresholdResponse,
    CreateThresholdRequest,
    UpdateThresholdRequest,
    AISessionResponse,
    AIPromptResponse,
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://89.47.113.24:30080';

const buildQueryString = (params: Record<string, any>): string => {
    const filteredParams = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    return filteredParams.length > 0 ? `?${filteredParams.join('&')}` : '';
};

export const apiService = {


    async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { 
                    success: false, 
                    message: data.message || data.error || 'Giriş başarısız',
                    error: data.error 
                };
            }
            console.log(data.data.accessToken);
            const decoded = jwtDecode<MyJwtPayload>(data.data.accessToken);
            const newData : LoginResponse = {
                ...data.data,
                role:decoded.role,
                userId: decoded.userId
            }
            return { success: true, data: newData };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async register(
        email: string, 
        password: string, 
        first_name: string, 
        last_name: string = '',
        role: string = 'user'
    ): Promise<ApiResponse<RegisterResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email, 
                    password,
                    first_name,
                    last_name,
                    role 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { 
                    success: false, 
                    message: data.message || data.error || 'Kayıt başarısız',
                    error: data.error 
                };
            }

            return { success: true, data };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async addPilot(
        email: string,
        first_name: string,
        last_name: string,
        accessToken: string
    ): Promise<ApiResponse<PilotResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/users/pilots`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    email,
                    first_name,
                    last_name,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Pilot ekleme başarısız',
                    error: data.error,
                };
            }

            return { success: true, data };
        } catch (error) {
            console.error('Add pilot error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async getPilots(accessToken: string, limit?: number, offset?: number): Promise<ApiResponse<PilotUser[]>> {
        try {
            const queryString = buildQueryString({ limit, offset });
            const response = await fetch(`${API_BASE_URL}/v1/users/${queryString}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Pilot listesi alınamadı',
                    error: data.error,
                };
            }

            const pilots = data.data?.users || data.data?.pilots || data.users || data.data || data;
            return { success: true, data: Array.isArray(pilots) ? pilots : [] };
        } catch (error) {
            console.error('Get pilots error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async getUserById(userId: number, accessToken: string): Promise<ApiResponse<UserResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Kullanıcı bilgisi alınamadı',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Get user error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async updateUser(
        userId: number,
        userData: UpdateUserRequest,
        accessToken: string
    ): Promise<ApiResponse<UserResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Kullanıcı güncelleme başarısız',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Update user error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async deleteUser(userId: number, accessToken: string): Promise<ApiResponse<void>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                return {
                    success: false,
                    message: data.message || data.error || 'Kullanıcı silme başarısız',
                    error: data.error,
                };
            }

            return { success: true };
        } catch (error) {
            console.error('Delete user error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async createAircraft(
        mac_address: string,
        name: string,
        current_airport_id: number,
        assigned_pilot_id: number,
        status: 'active' | 'inactive' | 'warning' | 'maintenance',
        accessToken: string
    ): Promise<ApiResponse<AircraftResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/aircrafts/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    mac_address,
                    name,
                    current_airport_id,
                    assigned_pilot_id,
                    status,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Uçak oluşturma başarısız',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Create aircraft error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async getAircraftById(aircraftId: number, accessToken: string): Promise<ApiResponse<AircraftResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/aircrafts/${aircraftId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Uçak bilgisi alınamadı',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Get aircraft error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async updateAircraft(
        aircraftId: number,
        aircraftData: UpdateAircraftRequest,
        accessToken: string
    ): Promise<ApiResponse<AircraftResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/aircrafts/${aircraftId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(aircraftData),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Uçak güncelleme başarısız',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Update aircraft error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async deleteAircraft(aircraftId: number, accessToken: string): Promise<ApiResponse<void>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/aircrafts/${aircraftId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                return {
                    success: false,
                    message: data.message || data.error || 'Uçak silme başarısız',
                    error: data.error,
                };
            }

            return { success: true };
        } catch (error) {
            console.error('Delete aircraft error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async getAircrafts(
        accessToken: string,
        params?: AircraftListParams
    ): Promise<ApiResponse<AircraftResponse[]>> {
        try {
            const queryString = buildQueryString(params || {});
            const response = await fetch(`${API_BASE_URL}/v1/aircrafts/${queryString}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Uçak listesi alınamadı',
                    error: data.error,
                };
            }

            const aircraftData = data.data?.aircraft || data.aircraft || data.data || data;
            return { success: true, data: Array.isArray(aircraftData) ? aircraftData : [] };
        } catch (error) {
            console.error('Get aircrafts error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async assignPilotToAircraft(
        aircraftId: number,
        pilotId: number,
        accessToken: string
    ): Promise<ApiResponse<AircraftResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/aircrafts/${aircraftId}/assign-pilot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ pilot_id: pilotId }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Pilot atama başarısız',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Assign pilot error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async getAirports(accessToken: string): Promise<ApiResponse<AirportResponse[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/airports/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Havaalanı listesi alınamadı',
                    error: data.error,
                };
            }

            const airports = data.data?.airports || data.airports || data.data || data;
            return { success: true, data: Array.isArray(airports) ? airports : [] };
        } catch (error) {
            console.error('Get airports error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async getAirportById(airportId: number, accessToken: string): Promise<ApiResponse<AirportResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/airports/${airportId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Havaalanı bilgisi alınamadı',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Get airport error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async createFlightPlan(
        flightPlanData: CreateFlightPlanRequest,
        accessToken: string
    ): Promise<ApiResponse<FlightPlanResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/flight-plans/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(flightPlanData),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Uçuş planı oluşturma başarısız',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Create flight plan error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async getFlightPlanById(flightPlanId: number, accessToken: string): Promise<ApiResponse<FlightPlanResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/flight-plans/${flightPlanId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Uçuş planı bilgisi alınamadı',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Get flight plan error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async updateFlightPlan(
        flightPlanId: number,
        flightPlanData: UpdateFlightPlanRequest,
        accessToken: string
    ): Promise<ApiResponse<FlightPlanResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/flight-plans/${flightPlanId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(flightPlanData),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Uçuş planı güncelleme başarısız',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Update flight plan error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async deleteFlightPlan(flightPlanId: number, accessToken: string): Promise<ApiResponse<void>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/flight-plans/${flightPlanId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                return {
                    success: false,
                    message: data.message || data.error || 'Uçuş planı silme başarısız',
                    error: data.error,
                };
            }

            return { success: true };
        } catch (error) {
            console.error('Delete flight plan error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async getFlightPlans(
        accessToken: string,
        params?: FlightPlanListParams
    ): Promise<ApiResponse<FlightPlanResponse[]>> {
        try {
            const queryString = buildQueryString(params || {});
            const response = await fetch(`${API_BASE_URL}/v1/flight-plans/${queryString}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Uçuş planı listesi alınamadı',
                    error: data.error,
                };
            }

            const flightPlans = data.data || data;
            return { success: true, data: Array.isArray(flightPlans) ? flightPlans : [] };
        } catch (error) {
            console.error('Get flight plans error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async getFlightPlansByAircraft(
        aircraftId: number,
        accessToken: string
    ): Promise<ApiResponse<FlightPlanResponse[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/flight-plans/aircraft/${aircraftId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Uçağa ait uçuş planları alınamadı',
                    error: data.error,
                };
            }

            const flightPlans = data.data || data;
            return { success: true, data: Array.isArray(flightPlans) ? flightPlans : [] };
        } catch (error) {
            console.error('Get flight plans by aircraft error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async createGeofence(
        geofenceData: CreateGeofenceRequest,
        accessToken: string
    ): Promise<ApiResponse<GeofenceResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/geofences/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(geofenceData),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Geofence oluşturma başarısız',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Create geofence error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async getGeofenceById(geofenceId: number, accessToken: string): Promise<ApiResponse<GeofenceResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/geofences/${geofenceId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Geofence bilgisi alınamadı',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Get geofence error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async updateGeofence(
        geofenceId: number,
        geofenceData: UpdateGeofenceRequest,
        accessToken: string
    ): Promise<ApiResponse<GeofenceResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/geofences/${geofenceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(geofenceData),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Geofence güncelleme başarısız',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Update geofence error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async deleteGeofence(geofenceId: number, accessToken: string): Promise<ApiResponse<void>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/geofences/${geofenceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                return {
                    success: false,
                    message: data.message || data.error || 'Geofence silme başarısız',
                    error: data.error,
                };
            }

            return { success: true };
        } catch (error) {
            console.error('Delete geofence error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async getGeofences(accessToken: string, active?: boolean): Promise<ApiResponse<GeofenceResponse[]>> {
        try {
            const queryString = active !== undefined ? buildQueryString({ active }) : '';
            const response = await fetch(`${API_BASE_URL}/v1/geofences/${queryString}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Geofence listesi alınamadı',
                    error: data.error,
                };
            }

            const geofences = data.data || data;
            return { success: true, data: Array.isArray(geofences) ? geofences : [] };
        } catch (error) {
            console.error('Get geofences error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async createThreshold(
        thresholdData: CreateThresholdRequest,
        accessToken: string
    ): Promise<ApiResponse<ThresholdResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/thresholds/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(thresholdData),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Threshold oluşturma başarısız',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Create threshold error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async getThresholdById(thresholdId: number, accessToken: string): Promise<ApiResponse<ThresholdResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/thresholds/${thresholdId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Threshold bilgisi alınamadı',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Get threshold error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async updateThreshold(
        thresholdId: number,
        thresholdData: UpdateThresholdRequest,
        accessToken: string
    ): Promise<ApiResponse<ThresholdResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/thresholds/${thresholdId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(thresholdData),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Threshold güncelleme başarısız',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Update threshold error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async deleteThreshold(thresholdId: number, accessToken: string): Promise<ApiResponse<void>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/thresholds/${thresholdId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                return {
                    success: false,
                    message: data.message || data.error || 'Threshold silme başarısız',
                    error: data.error,
                };
            }

            return { success: true };
        } catch (error) {
            console.error('Delete threshold error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async getThresholdsByAircraft(
        aircraftId: number,
        accessToken: string
    ): Promise<ApiResponse<ThresholdResponse[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/thresholds/aircraft/${aircraftId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Uçağa ait threshold\'lar alınamadı',
                    error: data.error,
                };
            }

            const thresholds = data.data || data;
            return { success: true, data: Array.isArray(thresholds) ? thresholds : [] };
        } catch (error) {
            console.error('Get thresholds by aircraft error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async getDefaultThresholds(accessToken: string): Promise<ApiResponse<ThresholdResponse[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/thresholds/defaults`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Varsayılan threshold\'lar alınamadı',
                    error: data.error,
                };
            }

            const thresholds = data.data || data;
            return { success: true, data: Array.isArray(thresholds) ? thresholds : [] };
        } catch (error) {
            console.error('Get default thresholds error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async getAISession(accessToken: string): Promise<ApiResponse<AISessionResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/ai-assistant/session`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'AI oturumu alınamadı',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Get AI session error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },

    async sendAIPrompt(prompt: string, accessToken: string): Promise<ApiResponse<AIPromptResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/ai-assistant/prompt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'AI yanıtı alınamadı',
                    error: data.error,
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            console.error('Send AI prompt error:', error);
            return { success: false, message: 'Ağ hatası', error: String(error) };
        }
    },
};
