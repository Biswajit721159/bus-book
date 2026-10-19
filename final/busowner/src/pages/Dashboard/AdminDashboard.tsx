import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { busApi } from '../../services/apiService';
import BusTable from '../../components/tables/BusTable';
import Loader, { Spinner } from '../../components/common/Loader';
import { Bus } from '../../types/bus';

const StatCard: React.FC<{
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  accent: {
    bg: string;
    border: string;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
  };
}> = ({ label, value, icon, trend, accent }) => {
  return (
    <div className={`p-3.5 sm:p-4 rounded-xl bg-white border ${accent.border} hover:border-blue-400 transition-all duration-200 group relative`}>
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent.iconBg} ${accent.iconColor} group-hover:scale-105 transition-transform duration-200`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${accent.badgeBg} ${accent.badgeText}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="mt-2.5 relative z-10">
        <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<Bus[]>([]);
  const [load, setLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoad(true);
      const response = await busApi.getAll();
      if (response?.statusCode === 200) {
        setData(response.data.data);
      } else {
        toast.warn(response?.message || 'Failed to fetch buses');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Could not load buses — check backend connection');
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const approved = data.filter((b) => b.status === 'approved').length;
  const pending = data.filter((b) => b.status === 'pending').length;
  const rejected = data.filter((b) => b.status === 'rejected').length;

  const filteredData = data.filter((bus) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      bus.bus_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.station_data?.some((s) => s.station?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || bus.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const PAGE_SIZE = 10;
  const totalPage = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const paginatedData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterStatus]);

  const onChangePage = (newPage: number) => {
    setPage(newPage);
    const tableElem = document.getElementById('bus-fleet-table');
    if (tableElem) {
      tableElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="page-container max-w-7xl animate-fade-in space-y-6">
      {/* Modern Dashboard Header */}
      <div className="rounded-xl bg-white border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold tracking-wide uppercase text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Fleet Operations Live
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Bus Fleet Overview
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Monitor route approvals, total fleet capacity, and schedule updates in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadData()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-all active:scale-95 cursor-pointer"
            title="Refresh Fleet"
          >
            <svg className={`w-3.5 h-3.5 text-slate-500 ${load ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/Buses/AddBus')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Bus</span>
          </button>
        </div>
      </div>



      {/* Modern Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          label="Total Buses"
          value={data.length}
          trend="Total Fleet"
          accent={{
            bg: 'bg-blue-400',
            border: 'border-blue-100',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            badgeBg: 'bg-blue-50',
            badgeText: 'text-blue-700',
          }}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          }
        />
        <StatCard
          label="Active / Approved"
          value={approved}
          trend={`${data.length > 0 ? Math.round((approved / data.length) * 100) : 0}% live`}
          accent={{
            bg: 'bg-emerald-400',
            border: 'border-emerald-100',
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            badgeBg: 'bg-emerald-50',
            badgeText: 'text-emerald-700',
          }}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Pending Review"
          value={pending}
          trend={pending > 0 ? "Needs Action" : (rejected > 0 ? `${rejected} Rejected` : "All Clear")}
          accent={{
            bg: 'bg-amber-400',
            border: 'border-amber-100',
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            badgeBg: 'bg-amber-50',
            badgeText: 'text-amber-700',
          }}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Catalog Pages"
          value={totalPage}
          trend={`Page ${page} of ${totalPage || 1}`}
          accent={{
            bg: 'bg-purple-400',
            border: 'border-purple-100',
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-600',
            badgeBg: 'bg-purple-50',
            badgeText: 'text-purple-700',
          }}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
      </div>

      {/* Table Card Section */}
      <div id="bus-fleet-table" className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Table Toolbar Header */}
        <div className="p-4 sm:p-4.5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight">Bus Fleet Registry</h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Showing {filteredData.length} of {data.length} registered vehicles
              </p>
            </div>
          </div>

          {/* Search & Filter pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search bus or station..."
                className="w-full pl-9 pr-3.5 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter buttons */}
            <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200/80">
              {(['all', 'approved', 'pending', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all capitalize cursor-pointer ${
                    filterStatus === status
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bus Table View */}
        {load && data.length === 0 ? (
          <div className="py-12 text-center">
            <Loader text="Loading bus fleet..." />
          </div>
        ) : (
          <div className={`relative transition-opacity duration-200 ${load ? 'opacity-70 pointer-events-none' : ''}`}>
            <BusTable data={paginatedData} onRefresh={loadData} />
            {load && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-xl z-10">
                <div className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-xl shadow-lg border border-slate-200 animate-fade-in">
                  <Spinner size="sm" color="blue" />
                  <span className="text-xs font-bold text-slate-700">Updating bus fleet...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modern Pagination Bar */}
      {totalPage > 1 && (
        <div className="flex items-center justify-between px-2 pt-2">
          <p className="text-xs font-semibold text-slate-400">
            Page <span className="text-slate-700 font-bold">{page}</span> of{' '}
            <span className="text-slate-700 font-bold">{totalPage}</span>
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onChangePage(page - 1)}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Prev</span>
            </button>

            {Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onChangePage(p)}
                className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all ${
                  p === page
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              onClick={() => onChangePage(page + 1)}
              disabled={page >= totalPage}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <span>Next</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
