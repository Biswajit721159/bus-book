import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bus, BusQuery } from '../../types/bus';
import { API_BASE_URL } from '../../utils/constants';

interface BusState {
  pendingBuss: Bus[];
  approvedBuss: Bus[];
  rejectedBuss: Bus[];
  isPending: boolean;
  isApproved: boolean;
  isRejected: boolean;
  totalPages: number;
  currentPage: number;
}

const initialState: BusState = {
  pendingBuss: [],
  approvedBuss: [],
  rejectedBuss: [],
  isPending: true,
  isApproved: false,
  isRejected: false,
  totalPages: 0,
  currentPage: 1,
};

const busSlice = createSlice({
  name: 'bus',
  initialState,
  reducers: {
    setIsPending: (state) => {
      state.isPending = true;
      state.isApproved = false;
      state.isRejected = false;
    },
    setIsApproved: (state) => {
      state.isPending = false;
      state.isApproved = true;
      state.isRejected = false;
    },
    setIsRejected: (state) => {
      state.isPending = false;
      state.isApproved = false;
      state.isRejected = true;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    addPendingBus: (state, action: PayloadAction<Bus>) => {
      state.pendingBuss.push(action.payload);
    },
    addApprovedBus: (state, action: PayloadAction<Bus>) => {
      state.approvedBuss.push(action.payload);
    },
    addRejectedBus: (state, action: PayloadAction<Bus>) => {
      state.rejectedBuss.push(action.payload);
    },
    removePendingBus: (state, action: PayloadAction<number>) => {
      state.pendingBuss.splice(action.payload, 1);
    },
    removeApprovedBus: (state, action: PayloadAction<number>) => {
      state.approvedBuss.splice(action.payload, 1);
    },
    removeRejectedBus: (state, action: PayloadAction<number>) => {
      state.rejectedBuss.splice(action.payload, 1);
    },
  },
});

export const busApiSlice = createApi({
  reducerPath: 'busApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const userinfoStr = localStorage.getItem('user');
      if (userinfoStr) {
        try {
          const userinfo = JSON.parse(userinfoStr);
          if (userinfo?.auth) {
            headers.set('Authorization', `Bearer ${userinfo.auth}`);
          }
        } catch {}
      }
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getBuss: builder.query<{ statusCode: number; message: string; data: { totalPage: number; result: Bus[] } }, BusQuery>({
      query: ({ page, approved, pending, rejected }) => ({
        url: 'buses/filter',
        method: 'POST',
        body: { page, approved, pending, rejected }
      }),
      transformResponse: (response: any) => {
        const mapBackendBusToFrontend = (bus: any): Bus => ({
          _id: String(bus.id),
          bus_name: bus.busName,
          Total_seat: bus.totalSeat,
          status: bus.status ? bus.status.toLowerCase() as any : 'pending',
          email: bus.email || '',
          createdAt: bus.createdAt || '',
          updatedAt: bus.updatedAt || '',
          station_data: (bus.stations || []).map((st: any) => ({
            station: st.stationName,
            arrived_time: st.arrivalTime,
            Distance_from_Previous_Station: st.distanceFromLastStation,
          })),
        });
        return {
          statusCode: response.status || response.statusCode || 200,
          message: response.message || 'Buses fetched',
          data: {
            totalPage: response.data?.totalPage || 1,
            result: (response.data?.result || []).map(mapBackendBusToFrontend)
          }
        };
      }
    }),
  }),
});

export const { useGetBussQuery } = busApiSlice;

export const {
  setIsPending,
  setIsApproved,
  setIsRejected,
  setTotalPages,
  setCurrentPage,
  addPendingBus,
  addApprovedBus,
  addRejectedBus,
  removePendingBus,
  removeApprovedBus,
  removeRejectedBus,
} = busSlice.actions;

export default busSlice.reducer;
