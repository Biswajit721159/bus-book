import { request } from './api/client';
import { BookingQuery, GetBookingsResponse } from '../types/booking';

export const getBookings = async (query: BookingQuery): Promise<GetBookingsResponse> => {
  return request<GetBookingsResponse>('booking/pagination', {
    method: 'POST',
    body: query,
  });
};
