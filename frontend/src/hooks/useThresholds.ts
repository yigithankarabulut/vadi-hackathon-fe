import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services';
import { useUser } from '../context/UserContext';
import type { Threshold, CreateThresholdForm } from '../types';

interface UseThresholdsOptions {
  autoFetch?: boolean;
  aircraftId?: number;
}

interface UseThresholdsReturn {
  thresholds: Threshold[];
  defaultThresholds: Threshold[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createThreshold: (data: CreateThresholdForm) => Promise<boolean>;
  updateThreshold: (id: number, data: Partial<CreateThresholdForm>) => Promise<boolean>;
  deleteThreshold: (id: number) => Promise<boolean>;
  getByAircraft: (aircraftId: number) => Promise<Threshold[]>;
  checkThreshold: (aircraftId: number, metricName: string, value: number) => 'normal' | 'warning' | 'critical';
}

export function useThresholds(options: UseThresholdsOptions = {}): UseThresholdsReturn {
  const { autoFetch = true, aircraftId } = options;
  const { user } = useUser();
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  const [defaultThresholds, setDefaultThresholds] = useState<Threshold[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThresholds = useCallback(async () => {
    if (!user?.access_token) {
      setError('Oturum açmanız gerekiyor');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const defaultResponse = await apiService.getDefaultThresholds(user.access_token);
      if (defaultResponse.success && defaultResponse.data) {
        setDefaultThresholds(defaultResponse.data);
      }

      if (aircraftId) {
        const aircraftResponse = await apiService.getThresholdsByAircraft(aircraftId, user.access_token);
        if (aircraftResponse.success && aircraftResponse.data) {
          setThresholds(aircraftResponse.data);
        }
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu');
      console.error('Fetch thresholds error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.access_token, aircraftId]);

  const createThreshold = useCallback(async (data: CreateThresholdForm): Promise<boolean> => {
    if (!user?.access_token) return false;

    const response = await apiService.createThreshold(data, user.access_token);

    if (response.success) {
      await fetchThresholds();
      return true;
    }
    return false;
  }, [user?.access_token, fetchThresholds]);

  const updateThreshold = useCallback(async (id: number, data: Partial<CreateThresholdForm>): Promise<boolean> => {
    if (!user?.access_token) return false;

    const response = await apiService.updateThreshold(id, data, user.access_token);

    if (response.success) {
      await fetchThresholds();
      return true;
    }
    return false;
  }, [user?.access_token, fetchThresholds]);

  const deleteThreshold = useCallback(async (id: number): Promise<boolean> => {
    if (!user?.access_token) return false;

    const response = await apiService.deleteThreshold(id, user.access_token);

    if (response.success) {
      await fetchThresholds();
      return true;
    }
    return false;
  }, [user?.access_token, fetchThresholds]);

  const getByAircraft = useCallback(async (targetAircraftId: number): Promise<Threshold[]> => {
    if (!user?.access_token) return [];

    const response = await apiService.getThresholdsByAircraft(targetAircraftId, user.access_token);

    if (response.success && response.data) {
      return response.data;
    }
    return [];
  }, [user?.access_token]);

  const checkThreshold = useCallback((targetAircraftId: number, metricName: string, value: number): 'normal' | 'warning' | 'critical' => {
    let threshold = thresholds.find(t => 
      t.aircraft_id === targetAircraftId && t.metric_name === metricName
    );

    if (!threshold) {
      threshold = defaultThresholds.find(t => t.metric_name === metricName && t.is_default);
    }

    if (!threshold) return 'normal';

    const range = threshold.max_value - threshold.min_value;
    const criticalMargin = range * 0.1;

    if (value < threshold.min_value - criticalMargin || value > threshold.max_value + criticalMargin) {
      return 'critical';
    }

    if (value < threshold.min_value || value > threshold.max_value) {
      return 'warning';
    }

    return 'normal';
  }, [thresholds, defaultThresholds]);

  useEffect(() => {
    if (autoFetch) {
      fetchThresholds();
    }
  }, [autoFetch, fetchThresholds]);

  return {
    thresholds,
    defaultThresholds,
    isLoading,
    error,
    refetch: fetchThresholds,
    createThreshold,
    updateThreshold,
    deleteThreshold,
    getByAircraft,
    checkThreshold,
  };
}
