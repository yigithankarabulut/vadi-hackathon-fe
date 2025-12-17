import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services';
import { useUser } from '../context/UserContext';
import type { Pilot } from '../types';

interface UsePilotsOptions {
  autoFetch?: boolean;
  limit?: number;
  offset?: number;
}

interface UsePilotsReturn {
  pilots: Pilot[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addPilot: (email: string, firstName: string, lastName: string) => Promise<boolean>;
  updatePilot: (id: number, data: any) => Promise<boolean>;
  deletePilot: (id: number) => Promise<boolean>;
  getPilotById: (id: number) => Promise<Pilot | null>;
}

export function usePilots(options: UsePilotsOptions = {}): UsePilotsReturn {
  const { autoFetch = true, limit, offset } = options;
  const { user } = useUser();
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transformPilot = (apiPilot: any): Pilot => ({
    ID: apiPilot.ID || apiPilot.id,
    id: apiPilot.ID || apiPilot.id,
    email: apiPilot.email,
    role: apiPilot.role,
    first_name: apiPilot.first_name,
    last_name: apiPilot.last_name,
    CreatedAt: apiPilot.CreatedAt,
    UpdatedAt: apiPilot.UpdatedAt,
    DeletedAt: apiPilot.DeletedAt,
  });

  const fetchPilots = useCallback(async () => {
    if (!user?.access_token) {
      setError('Oturum açmanız gerekiyor');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getPilots(user.access_token, limit, offset);

      if (response.success && response.data) {
        const transformedPilots = response.data.map(transformPilot);
        setPilots(transformedPilots);
      } else {
        setError(response.message || 'Pilot listesi alınamadı');
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu');
      console.error('Fetch pilots error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.access_token, limit, offset]);

  const addPilot = useCallback(async (email: string, firstName: string, lastName: string): Promise<boolean> => {
    if (!user?.access_token) return false;

    const response = await apiService.addPilot(email, firstName, lastName, user.access_token);

    if (response.success) {
      await fetchPilots();
      return true;
    }
    return false;
  }, [user?.access_token, fetchPilots]);

  const updatePilot = useCallback(async (id: number, data: any): Promise<boolean> => {
    if (!user?.access_token) return false;

    const response = await apiService.updateUser(id, data, user.access_token);

    if (response.success) {
      await fetchPilots();
      return true;
    }
    return false;
  }, [user?.access_token, fetchPilots]);

  const deletePilot = useCallback(async (id: number): Promise<boolean> => {
    if (!user?.access_token) return false;

    const response = await apiService.deleteUser(id, user.access_token);

    if (response.success) {
      await fetchPilots();
      return true;
    }
    return false;
  }, [user?.access_token, fetchPilots]);

  const getPilotById = useCallback(async (id: number): Promise<Pilot | null> => {
    if (!user?.access_token) return null;

    const response = await apiService.getUserById(id, user.access_token);

    if (response.success && response.data) {
      return response.data as unknown as Pilot;
    }
    return null;
  }, [user?.access_token]);

  useEffect(() => {
    if (autoFetch) {
      fetchPilots();
    }
  }, [autoFetch, fetchPilots]);

  return {
    pilots,
    isLoading,
    error,
    refetch: fetchPilots,
    addPilot,
    updatePilot,
    deletePilot,
    getPilotById,
  };
}
