import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services';
import { useUser } from '../context/UserContext';
import type { FlightPlan, CreateFlightPlanForm } from '../types';

interface UseFlightPlansOptions {
  autoFetch?: boolean;
  refreshInterval?: number;
  aircraftId?: number;
  status?: string;
}

interface UseFlightPlansReturn {
  flightPlans: FlightPlan[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createFlightPlan: (data: CreateFlightPlanForm) => Promise<boolean>;
  updateFlightPlan: (id: number, data: Partial<CreateFlightPlanForm>) => Promise<boolean>;
  deleteFlightPlan: (id: number) => Promise<boolean>;
  getByAircraft: (aircraftId: number) => Promise<FlightPlan[]>;
}

export function useFlightPlans(options: UseFlightPlansOptions = {}): UseFlightPlansReturn {
  const { autoFetch = true, refreshInterval, aircraftId, status } = options;
  const { user } = useUser();
  const [flightPlans, setFlightPlans] = useState<FlightPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFlightPlans = useCallback(async () => {
    if (!user?.access_token) {
      setError('Oturum açmanız gerekiyor');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getFlightPlans(user.access_token, {
        aircraft_id: aircraftId,
        status,
      });

      if (response.success && response.data) {
        setFlightPlans(response.data);
      } else {
        setError(response.message || 'Uçuş planları alınamadı');
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu');
      console.error('Fetch flight plans error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.access_token, aircraftId, status]);

  const createFlightPlan = useCallback(async (data: CreateFlightPlanForm): Promise<boolean> => {
    if (!user?.access_token) return false;

    const response = await apiService.createFlightPlan(data, user.access_token);

    if (response.success) {
      await fetchFlightPlans();
      return true;
    }
    return false;
  }, [user?.access_token, fetchFlightPlans]);

  const updateFlightPlan = useCallback(async (id: number, data: Partial<CreateFlightPlanForm>): Promise<boolean> => {
    if (!user?.access_token) return false;

    const response = await apiService.updateFlightPlan(id, data, user.access_token);

    if (response.success) {
      await fetchFlightPlans();
      return true;
    }
    return false;
  }, [user?.access_token, fetchFlightPlans]);

  const deleteFlightPlan = useCallback(async (id: number): Promise<boolean> => {
    if (!user?.access_token) return false;

    const response = await apiService.deleteFlightPlan(id, user.access_token);

    if (response.success) {
      await fetchFlightPlans();
      return true;
    }
    return false;
  }, [user?.access_token, fetchFlightPlans]);

  const getByAircraft = useCallback(async (targetAircraftId: number): Promise<FlightPlan[]> => {
    if (!user?.access_token) return [];

    const response = await apiService.getFlightPlansByAircraft(targetAircraftId, user.access_token);

    if (response.success && response.data) {
      return response.data;
    }
    return [];
  }, [user?.access_token]);

  useEffect(() => {
    if (autoFetch) {
      fetchFlightPlans();
    }
  }, [autoFetch, fetchFlightPlans]);

  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchFlightPlans, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, fetchFlightPlans]);

  return {
    flightPlans,
    isLoading,
    error,
    refetch: fetchFlightPlans,
    createFlightPlan,
    updateFlightPlan,
    deleteFlightPlan,
    getByAircraft,
  };
}
