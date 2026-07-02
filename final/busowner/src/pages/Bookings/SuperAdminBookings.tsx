import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../../store';
import {
  addEmail,
  addSrc,
  addDist,
  addBookingDate,
  addBusName,
  setCurrentPage,
  useGetBookingsQuery,
} from '../../store/slices/bookingSlice';
import BookingTable from '../../components/tables/BookingTable';
import FullPageLoader from '../../components/common/FullPageLoader';
import { BookingQuery } from '../../types/booking';
import InputField from '../../components/forms/InputField';

const FIELDS = [
  { name: 'Email', placeholder: 'Email address', type: 'text', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { name: 'Src', placeholder: 'Source', type: 'text', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  { name: 'Dist', placeholder: 'Destination', type: 'text', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
  { name: 'BusName', placeholder: 'Bus name', type: 'text', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { name: 'BookingDate', placeholder: 'Booking date', type: 'date', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
] as const;

const actionMap = {
  Email: addEmail,
  Src: addSrc,
  Dist: addDist,
  BookingDate: addBookingDate,
  BusName: addBusName,
};

const SearchingInput: React.FC = () => {
  const { Email, Src, Dist, BookingDate, BusName } = useSelector((state: RootState) => state.booking);
  const dispatch = useDispatch();
  const values = { Email, Src, Dist, BookingDate, BusName };

  const handleChange = (name: keyof typeof actionMap, value: string) => {
    dispatch(actionMap[name](value));
  };

  return (
    <div className="card p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span className="text-sm font-medium text-slate-600">Filter Bookings</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {FIELDS.map((field) => (
          <div key={field.name} className="relative">
            <InputField
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="pl-8 pr-7 text-xs"
              icon={
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
                </svg>
              }
              rightElement={
                values[field.name] && field.type !== 'date' ? (
                  <button
                    type="button"
                    onClick={() => handleChange(field.name, '')}
                    className="text-slate-300 hover:text-slate-500 transition-colors"
                    aria-label={`Clear ${field.name}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : undefined
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SuperAdminBookings: React.FC = () => {
  const { Email, Src, Dist, BookingDate, BusName, currentPage } = useSelector((state: RootState) => state.booking);
  const [queryParams, setQueryParams] = useState<BookingQuery>({
    currentPage,
    Email,
    Src,
    Dist,
    BookingDate,
    BusName,
  });
  const dispatch = useDispatch();

  // Handle debounce internally or directly use queryParams
  useEffect(() => {
    const handler = setTimeout(() => {
      setQueryParams({ currentPage: 1, Email, Src, Dist, BookingDate, BusName });
      dispatch(setCurrentPage(1));
    }, 400);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Email, Src, Dist, BookingDate, BusName]);

  useEffect(() => {
    setQueryParams((prev) => ({ ...prev, currentPage }));
  }, [currentPage]);

  const { data, error, isFetching } = useGetBookingsQuery(queryParams);
  const bookingData = data?.data?.bookingData || [];
  const totalPage = data?.data?.totalPage || 0;

  useEffect(() => {
    if (error) {
      toast.warn((error as any).message || 'An error occurred while fetching bookings');
    }
  }, [error]);

  const onChangePage = (newPage: number) => {
    dispatch(setCurrentPage(newPage));
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">Booking Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">Search and manage all passenger bookings</p>
      </div>

      <SearchingInput />

      {bookingData && <BookingTable data={bookingData} />}

      {totalPage > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            type="button"
            onClick={() => onChangePage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="btn-secondary px-3 py-2 disabled:opacity-40"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {Array.from({ length: Math.min(totalPage, 7) }, (_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onChangePage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  p === currentPage
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => onChangePage(currentPage + 1)}
            disabled={currentPage >= totalPage}
            className="btn-secondary px-3 py-2 disabled:opacity-40"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      <FullPageLoader open={isFetching} />
    </div>
  );
};

export default SuperAdminBookings;
