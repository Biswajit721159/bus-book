import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bus, BusQuery } from '../../types/bus';
import { API_BASE_URL } from '../../utils/constants';
import { mapBackendToBus } from '../../services/apiService';

interface BusState {
  isPending: boolean;
  isApproved: boolean;
  isRejected: boolean;
  totalPages: number;
  currentPage: number;
}

const initialState: BusState = {
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
  },
});

export const busApiSlice = createApi({
  reducerPath: 'busApi',
  tagTypes: ['Bus'],
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
      providesTags: (result) =>
        result?.data?.result
          ? [
              ...result.data.result.map(({ _id }) => ({ type: 'Bus' as const, id: _id })),
              { type: 'Bus' as const, id: 'LIST' },
            ]
          : [{ type: 'Bus' as const, id: 'LIST' }],
      transformResponse: (response: any) => ({
        statusCode: response.status || response.statusCode || 200,
        message: response.message || 'Buses fetched',
        data: {
          totalPage: response.data?.totalPage || 1,
          result: (response.data?.result || []).map(mapBackendToBus)
        }
      })
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
} = busSlice.actions;

export default busSlice.reducer;
