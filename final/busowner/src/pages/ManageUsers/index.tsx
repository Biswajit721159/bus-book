import React, { useState, useMemo } from 'react';
import { useGetUserQuery, useGetUserStatsQuery } from '../../store/slices/userApiSlice';
import UserTable from '../../components/tables/UserTable';
import Loader from '../../components/common/Loader';
import { UserRole } from '../../types/user';

export const ManageUsersPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [statusFilter, setStatusFilter] = useState<'' | 'active' | 'blocked'>('');
  const [search, setSearch] = useState('');

  // Fetch KPI Stats
  const { data: statsData, isFetching: isStatsFetching, refetch: refetchStats } = useGetUserStatsQuery();
  const stats = statsData?.data;

  // Build query params
  const isBlockedParam = useMemo(() => {
    if (statusFilter === 'active') return false;
    if (statusFilter === 'blocked') return true;
    return '';
  }, [statusFilter]);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search: search.trim() || undefined,
      role: roleFilter || undefined,
      isBlocked: isBlockedParam !== '' ? isBlockedParam : undefined,
    }),
    [page, limit, search, roleFilter, isBlockedParam]
  );

  // Fetch Users
  const { data, isLoading, isFetching, error, refetch: refetchUsers } = useGetUserQuery(queryParams);
  const users = data?.data?.result || [];
  const totalPage = data?.data?.totalPage || 1;
  const totalCount = data?.data?.totalCount || users.length;

  const handleRefresh = () => {
    refetchUsers();
    refetchStats();
  };

  const handleRoleTabChange = (newRole: UserRole | '') => {
    setRoleFilter(newRole);
    setPage(1);
  };

  const handleStatusChange = (newStatus: '' | 'active' | 'blocked') => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleClearFilters = () => {
    setRoleFilter('');
    setStatusFilter('');
    setSearch('');
    setPage(1);
  };

  const pageWindow = useMemo(() => {
    const delta = 2;
    const pages: number[] = [];
    const start = Math.max(1, page - delta);
    const end = Math.min(totalPage, page + delta);
    for (let p = start; p <= end; p++) {
      pages.push(p);
    }
    return pages;
  }, [page, totalPage]);

  return (
    <div className="page-container animate-fade-in space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="page-title">User Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              Super Admin
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            View, search, filter, update permissions, and block/unblock passengers, bus owners, and administrators
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isFetching || isStatsFetching}
          className="btn-secondary self-start sm:self-auto flex items-center gap-2 text-xs font-semibold px-4 py-2"
        >
          <svg
            className={`w-3.5 h-3.5 ${isFetching || isStatsFetching ? 'animate-spin text-blue-600' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh Data
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Users */}
        <div
          onClick={() => handleRoleTabChange('')}
          className={`card p-4 bg-white border cursor-pointer transition-all duration-150 hover:shadow-sm ${
            roleFilter === '' ? 'border-blue-500/80 ring-2 ring-blue-500/10' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Users</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{stats?.totalUsers ?? '—'}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">All registered accounts</p>
        </div>

        {/* Normal Passengers */}
        <div
          onClick={() => handleRoleTabChange('NORMAL_USER')}
          className={`card p-4 bg-white border cursor-pointer transition-all duration-150 hover:shadow-sm ${
            roleFilter === 'NORMAL_USER' ? 'border-sky-500/80 ring-2 ring-sky-500/10' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Passengers</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-black text-sky-700 mt-2">{stats?.normalUsers ?? '—'}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Normal booking users</p>
        </div>

        {/* Bus Owners */}
        <div
          onClick={() => handleRoleTabChange('BUS_OWNER')}
          className={`card p-4 bg-white border cursor-pointer transition-all duration-150 hover:shadow-sm ${
            roleFilter === 'BUS_OWNER' ? 'border-purple-500/80 ring-2 ring-purple-500/10' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Bus Owners</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-black text-purple-700 mt-2">{stats?.busOwners ?? '—'}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Fleet operator partners</p>
        </div>

        {/* Super Admins */}
        <div
          onClick={() => handleRoleTabChange('SUPER_ADMIN')}
          className={`card p-4 bg-white border cursor-pointer transition-all duration-150 hover:shadow-sm ${
            roleFilter === 'SUPER_ADMIN' ? 'border-amber-500/80 ring-2 ring-amber-500/10' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Super Admins</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">{stats?.superAdmins ?? '—'}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Platform administrators</p>
        </div>

        {/* Blocked Accounts */}
        <div
          onClick={() => handleStatusChange(statusFilter === 'blocked' ? '' : 'blocked')}
          className={`card p-4 bg-white border cursor-pointer transition-all duration-150 hover:shadow-sm col-span-2 lg:col-span-1 ${
            statusFilter === 'blocked' ? 'border-red-500/80 ring-2 ring-red-500/10' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Blocked Users</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-black text-red-600 mt-2">{stats?.blockedUsers ?? '—'}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Suspended access</p>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="card p-4 bg-white border border-slate-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {[
            { id: '', label: 'All Users', count: stats?.totalUsers },
            { id: 'NORMAL_USER', label: 'Passengers', count: stats?.normalUsers },
            { id: 'BUS_OWNER', label: 'Bus Owners', count: stats?.busOwners },
            { id: 'SUPER_ADMIN', label: 'Super Admins', count: stats?.superAdmins },
          ].map((tab) => {
            const isActive = roleFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleRoleTabChange(tab.id as UserRole | '')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                      isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Controls: Status & Search */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked Only</option>
          </select>

          {/* Search Box */}
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search name, email, phone..."
              className="w-full pl-9 pr-8 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Clear Filters Button */}
          {(roleFilter || statusFilter || search) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-2.5 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              title="Reset all filters"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      {isLoading ? (
        <div className="card p-12 text-center bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <Loader text="Loading user accounts..." />
        </div>
      ) : error ? (
        <div className="card p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex flex-col items-center gap-3 text-red-500 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-800">Failed to load users</h3>
            <p className="text-xs text-slate-500">
              {(error as any)?.data?.message || (error as any)?.message || 'An error occurred while fetching user accounts.'}
            </p>
            <button
              type="button"
              onClick={handleRefresh}
              className="btn-primary mt-2 text-xs px-5 py-2"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="card bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-800">User Records</h2>
              <span className="text-xs text-slate-400 font-medium">({totalCount} users found)</span>
            </div>

            {/* Per-page selection */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Rows per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <UserTable data={users} onRefresh={handleRefresh} />

          {/* Pagination bar */}
          {totalPage > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-500 font-medium">
                Page <span className="font-bold text-slate-800">{page}</span> of{' '}
                <span className="font-bold text-slate-800">{totalPage}</span>
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="btn-secondary px-3 py-1.5 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                >
                  Prev
                </button>

                {pageWindow.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      p === page
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                  disabled={page >= totalPage}
                  className="btn-secondary px-3 py-1.5 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;
