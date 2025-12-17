import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services';
import { useUser } from '../context/UserContext';
import type { Geofence, CreateGeofenceForm } from '../types';

interface UseGeofencesOptions {
  autoFetch?: boolean;
  refreshInterval?: number;
  activeOnly?: boolean;
}

interface UseGeofencesReturn {
  geofences: Geofence[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createGeofence: (data: CreateGeofenceForm) => Promise<boolean>;
  updateGeofence: (id: number, data: Partial<CreateGeofenceForm>) => Promise<boolean>;
  deleteGeofence: (id: number) => Promise<boolean>;
  checkAircraftInGeofence: (lat: number, lng: number) => Geofence[];
}

const GEOFENCE_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
];

export function useGeofences(options: UseGeofencesOptions = {}): UseGeofencesReturn {
  const { autoFetch = true, refreshInterval, activeOnly } = options;
  const { user } = useUser();
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGeofences = useCallback(async () => {
    if (!user?.access_token) {
      setError('Oturum açmanız gerekiyor');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getGeofences(user.access_token, activeOnly);

      if (response.success && response.data) {
        const coloredGeofences = response.data.map((geofence, index) => ({
          ...geofence,
          color: GEOFENCE_COLORS[index % GEOFENCE_COLORS.length],
        }));
        setGeofences(coloredGeofences);
      } else {
        setError(response.message || 'Geofence listesi alınamadı');
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu');
      console.error('Fetch geofences error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.access_token, activeOnly]);

  const createGeofence = useCallback(async (data: CreateGeofenceForm): Promise<boolean> => {
    if (!user?.access_token) return false;

    const response = await apiService.createGeofence(data, user.access_token);

    if (response.success) {
      await fetchGeofences();
      return true;
    }
    return false;
  }, [user?.access_token, fetchGeofences]);

  const updateGeofence = useCallback(async (id: number, data: Partial<CreateGeofenceForm>): Promise<boolean> => {
    if (!user?.access_token) return false;

    const response = await apiService.updateGeofence(id, data, user.access_token);

    if (response.success) {
      await fetchGeofences();
      return true;
    }
    return false;
  }, [user?.access_token, fetchGeofences]);

  const deleteGeofence = useCallback(async (id: number): Promise<boolean> => {
    if (!user?.access_token) return false;

    const response = await apiService.deleteGeofence(id, user.access_token);

    if (response.success) {
      await fetchGeofences();
      return true;
    }
    return false;
  }, [user?.access_token, fetchGeofences]);

  const checkAircraftInGeofence = useCallback((lat: number, lng: number): Geofence[] => {
    return geofences.filter(geofence => 
      geofence.is_active &&
      lat >= geofence.min_latitude &&
      lat <= geofence.max_latitude &&
      lng >= geofence.min_longitude &&
      lng <= geofence.max_longitude
    );
  }, [geofences]);

  useEffect(() => {
    if (autoFetch) {
      fetchGeofences();
    }
  }, [autoFetch, fetchGeofences]);

  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchGeofences, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, fetchGeofences]);

  return {
    geofences,
    isLoading,
    error,
    refetch: fetchGeofences,
    createGeofence,
    updateGeofence,
    deleteGeofence,
    checkAircraftInGeofence,
  };
}
