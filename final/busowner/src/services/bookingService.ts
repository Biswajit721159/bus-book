import { request } from './api/client';
import { BookingQuery, GetBookingsResponse } from '../types/booking';

export const getBookings = async (query: BookingQuery): Promise<GetBookingsResponse> => {
  return request<GetBookingsResponse>('booking/pagination', {
    method: 'POST',
    body: {
      currentPage: query.currentPage,
      email: query.email || query.Email,
      Email: query.Email || query.email,
      src: query.src || query.Src,
      Src: query.Src || query.src,
      dist: query.dist || query.Dist,
      Dist: query.Dist || query.dist,
      bookingDate: query.bookingDate || query.BookingDate,
      BookingDate: query.BookingDate || query.bookingDate,
      busName: query.busName || query.BusName,
      BusName: query.BusName || query.busName,
    },
  });
};
