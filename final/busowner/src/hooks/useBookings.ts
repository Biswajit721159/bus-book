import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  addEmail,
  addSrc,
  addDist,
  addBookingDate,
  addBusName,
  setCurrentPage,
  useGetBookingsQuery,
} from '../store/slices/bookingSlice';
import { bookingApi } from '../services/apiService';

export const useBookings = () => {
  const dispatch = useDispatch();
  const bookingState = useSelector((state: RootState) => state.booking);

  const setEmailFilter = (email: string) => dispatch(addEmail(email));
  const setSrcFilter = (src: string) => dispatch(addSrc(src));
  const setDistFilter = (dist: string) => dispatch(addDist(dist));
  const setDateFilter = (date: string) => dispatch(addBookingDate(date));
  const setBusNameFilter = (name: string) => dispatch(addBusName(name));
  const setPage = (page: number) => dispatch(setCurrentPage(page));

  const fetchBookingStatus = async (date: string, busId: string, pageNo: string | number = 1) =>
    bookingApi.getByStatus(date, busId, pageNo);

  const fetchSuperAdminBookings = async (page: number) =>
    bookingApi.paginate({ currentPage: page });

  return {
    ...bookingState,
    setEmailFilter,
    setSrcFilter,
    setDistFilter,
    setDateFilter,
    setBusNameFilter,
    setPage,
    fetchBookingStatus,
    fetchSuperAdminBookings,
    useGetBookingsQuery,
  };
};
