/**
 * @deprecated Use `../apiService` (busApi, bookingApi) instead.
 * This file is kept only for backward compatibility during migration.
 */
export { busApi as getBusesApi, bookingApi as bookingService } from './apiService';

import { busApi, bookingApi } from './apiService';
import type { Bus, StationData } from '../types/bus';

// Legacy thin wrappers — delegate to the new unified apiService
export const getBuses = (page = 1) => busApi.getAll();
export const getBussByEmail = () => busApi.getAll();
export const getBusById = (id: string) => busApi.getById(id);
export const addBus = (busName: string, seat: string | number, stationData: StationData[]) =>
  busApi.create(busName, seat, stationData);
export const editBus = (busData: Partial<Bus>) => busApi.update(busData);
export const findBusByFilter = (page: number, approved = false, pending = true, rejected = false) =>
  busApi.filter(page, approved, pending, rejected);
export const getBookingStatus = (date: string, busId: string, pageNo: string | number = 1) =>
  bookingApi.getByStatus(date, busId, pageNo);
