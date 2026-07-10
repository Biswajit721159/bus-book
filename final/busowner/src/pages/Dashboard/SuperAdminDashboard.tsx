import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../../store';
import {
  setIsApproved,
  setIsPending,
  setIsRejected,
  setTotalPages,
  setCurrentPage,
  useGetBussQuery,
} from '../../store/slices/busSlice';
import BusTable from '../../components/tables/BusTable';
import FullPageLoader from '../../components/common/FullPageLoader';
import { BusQuery } from '../../types/bus';

const FILTERS = [
  {
    key: 'pending',
    label: 'Pending',
    action: setIsPending,
    activeClass: 'bg-amber-500 text-white shadow-sm',
    iconColor: 'text-amber-500',
    dotColor: 'bg-amber-400',
  },
  {
    key: 'approved',
    label: 'Approved',
    action: setIsApproved,
    activeClass: 'bg-emerald-500 text-white shadow-sm',
    iconColor: 'text-emerald-500',
    dotColor: 'bg-emerald-400',
  },
  {
    key: 'rejected',
    label: 'Rejected',
    action: setIsRejected,
    activeClass: 'bg-red-500 text-white shadow-sm',
    iconColor: 'text-red-500',
    dotColor: 'bg-red-400',
  },
] as const;

export const SuperAdminDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const {
    isPending: pending,
    isApproved: approved,
    isRejected: rejected,
    totalPages,
    currentPage,
  } = useSelector((state: RootState) => state.busDetails);

  const [queryParams, setQueryParams] = useState<BusQuery>({
    page: currentPage,
    approved,
    pending,
    rejected,
  });

  const { data, error, isFetching } = useGetBussQuery(queryParams);
  const totalPage = data?.data?.totalPage || 0;
  const busList = data?.data?.result || [];

  useEffect(() => {
    const changed =
      (queryParams.pending && approved && !rejected) ||
      (queryParams.pending && rejected && !approved) ||
      (queryParams.approved && pending && !rejected) ||
      (queryParams.approved && rejected && !pending) ||
      (queryParams.rejected && approved && !pending) ||
      (queryParams.rejected && pending && !approved);

    let page = currentPage;
    if (changed) { page = 1; dispatch(setCurrentPage(page)); }
    setQueryParams({ page, approved, pending, rejected });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approved, pending, rejected, currentPage]);

  useEffect(() => { dispatch(setTotalPages(totalPage)); }, [data]); // eslint-disable-line
  useEffect(() => {
    if (error) toast.warn((error as any).message || 'Failed to fetch buses');
  }, [error]);

  const onChangePage = (newPage: number) => dispatch(setCurrentPage(newPage));
  const activeFilter = pending ? 'pending' : approved ? 'approved' : 'rejected';
  const activeCount = busList.length;

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="page-title">Bus Management</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Review, approve, and manage all bus registrations</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
          <div className={`w-2 h-2 rounded-full ${FILTERS.find(f => f.key === activeFilter)?.dotColor} animate-pulse`} />
          <span className="text-xs font-semibold text-slate-600 capitalize">{activeFilter}</span>
          <span className="text-xs text-slate-400 ml-1">{activeCount} buses</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 p-1 bg-slate-100 rounded-2xl w-fit">
        {FILTERS.map(({ key, label, action, activeClass }) => {
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => dispatch(action())}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive ? activeClass : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="card-header flex items-center justify-between">
          <h2 className="section-title capitalize">{activeFilter} Buses</h2>
          <span className="text-xs text-slate-400 font-medium">Page {currentPage} of {totalPages || 1}</span>
        </div>
        {busList.length === 0 && !isFetching ? (
          <div className="p-16 text-center">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm font-semibold">No {activeFilter} buses found</p>
            </div>
          </div>
        ) : (
          <BusTable data={busList} />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button type="button" onClick={() => onChangePage(currentPage - 1)} disabled={currentPage <= 1} className="btn-secondary px-3 py-2 disabled:opacity-40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChangePage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                p === currentPage
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-primary-50 hover:border-primary-200'
              }`}
            >
              {p}
            </button>
          ))}
          <button type="button" onClick={() => onChangePage(currentPage + 1)} disabled={currentPage >= totalPages} className="btn-secondary px-3 py-2 disabled:opacity-40">
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

export default SuperAdminDashboard;
