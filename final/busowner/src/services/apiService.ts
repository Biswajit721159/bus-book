import { request } from './api/client';
import { API_ENDPOINTS } from './api/endpoints';
import type { Bus, StationData } from '../types/bus';
import type { Booking } from '../types/booking';

// ─── Shared Response Wrapper ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// ─── Field Mappers ─────────────────────────────────────────────────────────────

export const mapBackendToBus = (raw: any): Bus => ({
  _id: String(raw.id),
  bus_name: raw.busName,
  Total_seat: raw.totalSeat,
  status: raw.status ? (raw.status.toLowerCase() as Bus['status']) : 'pending',
  email: raw.email || '',
  createdAt: raw.createdAt || '',
  updatedAt: raw.updatedAt || '',
  station_data: (raw.stations || []).map((st: any) => ({
    station: st.stationName,
    arrived_time: st.arrivalTime,
    Distance_from_Previous_Station: st.distanceFromLastStation,
  })),
});

const mapBusToBackend = (
  busName: string,
  seat: string | number,
  stationData: StationData[]
) => ({
  busName,
  totalSeat: Number(seat),
  stations: stationData.map((st) => ({
    stationName: st.station,
    arrivalTime: st.arrived_time,
    distanceFromLastStation: st.Distance_from_Previous_Station,
  })),
});

// ─── Bus API ──────────────────────────────────────────────────────────────────

export const busApi = {
  getAll: async (): Promise<ApiResponse<{ totalPage: number; data: Bus[] }>> => {
    const res = await request<ApiResponse<any[]>>(API_ENDPOINTS.BUS.LIST);
    return {
      statusCode: res.statusCode,
      message: res.message,
      data: { totalPage: 1, data: (res.data || []).map(mapBackendToBus) },
    };
  },

  filter: async (
    page: number,
    approved = false,
    pending = true,
    rejected = false
  ): Promise<{ totalPage: number; result: Bus[] }> => {
    const res = await request<ApiResponse<{ totalPage: number; result: any[] }>>(
      API_ENDPOINTS.BUS.FILTER,
      { method: 'POST', body: { page, approved, pending, rejected } }
    );
    return {
      totalPage: res.data?.totalPage || 1,
      result: (res.data?.result || []).map(mapBackendToBus),
    };
  },

  create: async (
    busName: string,
    seat: string | number,
    stationData: StationData[]
  ): Promise<ApiResponse<Bus>> => {
    const res = await request<ApiResponse<any>>(API_ENDPOINTS.BUS.CREATE, {
      method: 'POST',
      body: mapBusToBackend(busName, seat, stationData),
    });
    return { ...res, data: mapBackendToBus(res.data) };
  },

  getById: async (id: string): Promise<ApiResponse<Bus>> => {
    const res = await request<ApiResponse<any>>(API_ENDPOINTS.BUS.BY_ID(id));
    return { ...res, data: mapBackendToBus(res.data) };
  },

  update: async (busData: Partial<Bus>): Promise<ApiResponse<Bus>> => {
    const body = {
      ...mapBusToBackend(busData.bus_name || '', busData.Total_seat || 0, busData.station_data || []),
      status: busData.status,
    };
    const res = await request<ApiResponse<any>>(API_ENDPOINTS.BUS.UPDATE(busData._id!), {
      method: 'PUT',
      body,
    });
    return { ...res, data: mapBackendToBus(res.data) };
  },
};

// ─── Booking API ──────────────────────────────────────────────────────────────

export interface BookingQuery {
  currentPage: number;
  Email?: string;
  Src?: string;
  Dist?: string;
  BookingDate?: string;
  BusName?: string;
}

export const bookingApi = {
  getByStatus: async (date: string, busId: string, pageNo: string | number = 1): Promise<ApiResponse<Booking[]>> =>
    request<ApiResponse<Booking[]>>(API_ENDPOINTS.BOOKING.STATUS(String(pageNo)), {
      method: 'PATCH',
      body: { date, bus_id: Number(busId) },
    }),

  paginate: async (query: BookingQuery): Promise<ApiResponse<{ totalPage: number; bookingData: Booking[] }>> =>
    request<ApiResponse<{ totalPage: number; bookingData: Booking[] }>>(
      API_ENDPOINTS.BOOKING.PAGINATION,
      { method: 'POST', body: query }
    ),
};

// ─── User API ─────────────────────────────────────────────────────────────────

export const userApi = {
  updateProfile: async (name: string, email: string): Promise<ApiResponse<null>> =>
    request<ApiResponse<null>>(API_ENDPOINTS.USER.UPDATE_PROFILE, {
      method: 'PUT',
      body: { name, email },
    }),
};
