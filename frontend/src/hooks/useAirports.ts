import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services';
import { useUser } from '../context/UserContext';
import type { Airport } from '../types';

interface UseAirportsOptions {
  autoFetch?: boolean;
}

interface UseAirportsReturn {
  airports: Airport[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getById: (id: number) => Promise<Airport | null>;
}

export function useAirports(options: UseAirportsOptions = {}): UseAirportsReturn {
  const { autoFetch = true } = options;
  const { user } = useUser();
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transformAirport = (apiAirport: any): Airport => ({
    id: apiAirport.ID || apiAirport.id,
    name: apiAirport.name,
    code: apiAirport.code,
    city: apiAirport.city,
    country: apiAirport.country,
    latitude: apiAirport.latitude,
    longitude: apiAirport.longitude,
  });

  const fetchAirports = useCallback(async () => {
    if (!user?.access_token) {
      setError('Oturum açmanız gerekiyor');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getAirports(user.access_token);

      if (response.success && response.data) {
        const transformedAirports = response.data.map(transformAirport);
        setAirports(transformedAirports);
      } else {
        setError(response.message || 'Havaalanları listesi alınamadı');
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu');
      console.error('Fetch airports error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.access_token]);

  const getById = useCallback(async (id: number): Promise<Airport | null> => {
    if (!user?.access_token) return null;

    const response = await apiService.getAirportById(id, user.access_token);

    if (response.success && response.data) {
      return response.data;
    }
    return null;
  }, [user?.access_token]);

  useEffect(() => {
    if (autoFetch) {
      fetchAirports();
    }
  }, [autoFetch, fetchAirports]);

  return {
    airports,
    isLoading,
    error,
    refetch: fetchAirports,
    getById,
  };
}
