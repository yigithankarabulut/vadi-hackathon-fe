import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services';
import { useUser } from '../context/UserContext';
import type { Aircraft, TimeSeriesData } from '../types';

interface UseAircraftsOptions {
  autoFetch?: boolean;
  refreshInterval?: number;
  ownerId?: number;
  pilotId?: number;
}

interface UseAircraftsReturn {
  aircrafts: Aircraft[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createAircraft: (data: {
    mac_address: string;
    name: string;
    current_airport_id: number;
    assigned_pilot_id: number;
    status: 'active' | 'inactive' | 'warning' | 'maintenance';
  }) => Promise<boolean>;
  updateAircraft: (id: number, data: any) => Promise<boolean>;
  deleteAircraft: (id: number) => Promise<boolean>;
  assignPilot: (aircraftId: number, pilotId: number) => Promise<boolean>;
}

const generateMockPosition = (): [number, number] => {
  return [
    36 + Math.random() * 6,
    26 + Math.random() * 18,
  ];
};

const generateTimeSeriesData = (baseValue: number, count: number = 60): TimeSeriesData[] => {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => ({
    timestamp: now - (count - i) * 1000,
    value: baseValue + (Math.random() - 0.5) * baseValue * 0.1,
  }));
};

export function useAircrafts(options: UseAircraftsOptions = {}): UseAircraftsReturn {
  const { autoFetch = true, refreshInterval, ownerId, pilotId } = options;
  const { user } = useUser();
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transformApiAircraft = (apiAircraft: any): Aircraft => {
    const id = apiAircraft.ID || apiAircraft.id;
    const currentAirport = apiAircraft.current_airport;
    const assignedPilot = apiAircraft.assigned_pilot;

    const position: [number, number] = currentAirport 
      ? [currentAirport.latitude, currentAirport.longitude]
      : generateMockPosition();
    
    const baseSpeed = apiAircraft.status === 'active' ? 400 + Math.random() * 100 : 0;
    const baseAltitude = apiAircraft.status === 'active' ? 25000 + Math.random() * 15000 : 0;

    return {
      id: String(id),
      name: apiAircraft.name,
      mac_address: apiAircraft.mac_address,
      position,
      altitude: Math.round(baseAltitude),
      speed: Math.round(baseSpeed),
      status: apiAircraft.status || 'inactive',
      current_airport_id: apiAircraft.current_airport_id,
      assigned_pilot_id: apiAircraft.assigned_pilot_id,
      current_airport: currentAirport ? {
        id: currentAirport.ID || currentAirport.id,
        name: currentAirport.name,
        code: currentAirport.code,
        city: currentAirport.city,
        latitude: currentAirport.latitude,
        longitude: currentAirport.longitude,
      } : undefined,
      assigned_pilot: assignedPilot ? {
        ID: assignedPilot.ID || assignedPilot.id,
        id: assignedPilot.ID || assignedPilot.id,
        email: assignedPilot.email,
        role: assignedPilot.role,
        first_name: assignedPilot.first_name,
        last_name: assignedPilot.last_name,
      } : undefined,
      motorTemp: apiAircraft.status === 'active' ? 70 + Math.random() * 20 : 45,
      externalTemp: 20 + Math.random() * 15,
      speedHistory: generateTimeSeriesData(baseSpeed),
      altitudeHistory: generateTimeSeriesData(baseAltitude),
      route: apiAircraft.status === 'active' ? [
        position,
        [position[0] + (Math.random() - 0.5) * 2, position[1] + (Math.random() - 0.5) * 2],
        [position[0] + (Math.random() - 0.5) * 4, position[1] + (Math.random() - 0.5) * 4],
      ] : undefined,
    };
  };

  const fetchAircrafts = useCallback(async () => {
    if (!user?.access_token) {
      setError('Oturum açmanız gerekiyor');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getAircrafts(user.access_token, {
        owner_id: ownerId,
        pilot_id: pilotId,
      });

      if (response.success && response.data) {
        const transformedAircrafts = response.data.map(transformApiAircraft);
        setAircrafts(transformedAircrafts);
      } else {
        setError(response.message || 'Uçak listesi alınamadı');
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu');
      console.error('Fetch aircrafts error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.access_token, ownerId, pilotId]);

  const createAircraft = useCallback(async (data: {
    mac_address: string;
    name: string;
    current_airport_id: number;
    assigned_pilot_id: number;
    status: 'active' | 'inactive' | 'warning' | 'maintenance';
  }): Promise<boolean> => {
    if (!user?.access_token) return false;

    const response = await apiService.createAircraft(
      data.mac_address,
      data.name,
      data.current_airport_id,
      data.assigned_pilot_id,
      data.status,
      user.access_token
    );

    if (response.success) {
      await fetchAircrafts();
      return true;
    }
    return false;
  }, [user?.access_token, fetchAircrafts]);

  const updateAircraft = useCallback(async (id: number, data: any): Promise<boolean> => {
    if (!user?.access_token) return false;

    const response = await apiService.updateAircraft(id, data, user.access_token);

    if (response.success) {
      await fetchAircrafts();
      return true;
    }
    return false;
  }, [user?.access_token, fetchAircrafts]);

  const deleteAircraft = useCallback(async (id: number): Promise<boolean> => {
    if (!user?.access_token) return false;

    const response = await apiService.deleteAircraft(id, user.access_token);

    if (response.success) {
      await fetchAircrafts();
      return true;
    }
    return false;
  }, [user?.access_token, fetchAircrafts]);

  const assignPilot = useCallback(async (aircraftId: number, pilotId: number): Promise<boolean> => {
    if (!user?.access_token) return false;

    const response = await apiService.assignPilotToAircraft(aircraftId, pilotId, user.access_token);

    if (response.success) {
      await fetchAircrafts();
      return true;
    }
    return false;
  }, [user?.access_token, fetchAircrafts]);

  useEffect(() => {
    if (autoFetch) {
      fetchAircrafts();
    }
  }, [autoFetch, fetchAircrafts]);

  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchAircrafts, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, fetchAircrafts]);

  return {
    aircrafts,
    isLoading,
    error,
    refetch: fetchAircrafts,
    createAircraft,
    updateAircraft,
    deleteAircraft,
    assignPilot,
  };
}
