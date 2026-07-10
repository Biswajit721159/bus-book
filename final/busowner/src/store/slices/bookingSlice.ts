import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BookingQuery, GetBookingsResponse } from '../../types/booking';
import { API_BASE_URL } from '../../utils/constants';

const initialState: BookingQuery = {
  Email: '',
  Src: '',
  Dist: '',
  BookingDate: '',
  BusName: '',
  currentPage: 1,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    addEmail: (state, action: PayloadAction<string>) => {
      state.Email = action.payload;
    },
    addSrc: (state, action: PayloadAction<string>) => {
      state.Src = action.payload;
    },
    addDist: (state, action: PayloadAction<string>) => {
      state.Dist = action.payload;
    },
    addBookingDate: (state, action: PayloadAction<string>) => {
      state.BookingDate = action.payload;
    },
    addBusName: (state, action: PayloadAction<string>) => {
      state.BusName = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const bookingApiSlice = createApi({
  reducerPath: 'bookingApi',
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
    getBookings: builder.query<GetBookingsResponse, BookingQuery>({
      query: (data) => ({
        url: 'booking/pagination',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGetBookingsQuery } = bookingApiSlice;
export const { addEmail, addSrc, addDist, addBookingDate, addBusName, setCurrentPage } = bookingSlice.actions;
export default bookingSlice.reducer;
