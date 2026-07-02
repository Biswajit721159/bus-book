import { Driver } from '../types/driver';

const STORAGE_KEY = 'mock_drivers';

const DEFAULT_DRIVERS: Driver[] = [
  { id: 'drv-1', name: 'Rajesh Kumar', licenseNumber: 'DL1420200012345', phone: '9876543210', status: 'available' },
  { id: 'drv-2', name: 'Amit Sharma', licenseNumber: 'MH0220180098765', phone: '9812345670', status: 'on_trip' },
  { id: 'drv-3', name: 'Sanjay Singh', licenseNumber: 'UP1620150045678', phone: '9988776655', status: 'leave' },
];

export const getDrivers = async (): Promise<Driver[]> => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DRIVERS));
    return DEFAULT_DRIVERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_DRIVERS;
  }
};

export const saveDriver = async (driver: Driver): Promise<Driver> => {
  const drivers = await getDrivers();
  const existingIndex = drivers.findIndex((d) => d.id === driver.id);
  if (existingIndex > -1) {
    drivers[existingIndex] = driver;
  } else {
    drivers.push(driver);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drivers));
  return driver;
};

export const deleteDriver = async (id: string): Promise<boolean> => {
  const drivers = await getDrivers();
  const updated = drivers.filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return true;
};
