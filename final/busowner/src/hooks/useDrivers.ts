import { useState, useCallback } from 'react';
import { Driver } from '../types/driver';
import { getDrivers, saveDriver, deleteDriver } from '../services/driverService';

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load drivers');
    } finally {
      setLoading(false);
    }
  }, []);

  const addOrUpdateDriver = useCallback(async (driver: Driver) => {
    setLoading(true);
    setError(null);
    try {
      await saveDriver(driver);
      await fetchDrivers();
    } catch (err: any) {
      setError(err?.message || 'Failed to save driver');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDrivers]);

  const removeDriver = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDriver(id);
      await fetchDrivers();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete driver');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDrivers]);

  return {
    drivers,
    loading,
    error,
    fetchDrivers,
    addOrUpdateDriver,
    removeDriver,
  };
};
