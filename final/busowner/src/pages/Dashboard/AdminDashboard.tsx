import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { busApi } from '../../services/apiService';
import BusTable from '../../components/tables/BusTable';
import FullPageLoader from '../../components/common/FullPageLoader';
import { Bus } from '../../types/bus';

const StatCard: React.FC<{
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}> = ({ label, value, icon, color }) => (
  <div className={`card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow duration-200`}>
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
    </div>
  </div>
);

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<Bus[]>([]);
  const [load, setLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const navigate = useNavigate();

  const loadData = async (p = 1) => {
    try {
      setLoad(true);
      const response = await busApi.getAll();
      if (response?.statusCode === 200) {
        setData(response.data.data);
        setTotalPage(response.data.totalPage);
      } else {
        toast.warn(response?.message || 'Failed to fetch buses');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Could not load buses — check backend connection');
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => { loadData(1); }, []);

  const onChangePage = (newPage: number) => {
    setPage(newPage);
    loadData(newPage);
  };

  const approved = data.filter((b) => b.status === 'approved').length;
  const pending = data.filter((b) => b.status === 'pending').length;

  return (
    <div className="page-container max-w-6xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">My Buses</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage and track all your registered buses</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/Buses/AddBus')}
          className="btn-primary"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Bus
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Buses"
          value={data.length}
          color="bg-primary-50"
          icon={<svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
        />
        <StatCard
          label="Approved"
          value={approved}
          color="bg-emerald-50"
          icon={<svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Pending"
          value={pending}
          color="bg-amber-50"
          icon={<svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Total Pages"
          value={totalPage}
          color="bg-violet-50"
          icon={<svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="card-header flex items-center justify-between">
          <h2 className="section-title">Bus Registry</h2>
          <span className="text-xs text-slate-400 font-medium">{data.length} total</span>
        </div>
        <BusTable data={data} />
      </div>

      {/* Pagination */}
      {totalPage > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button type="button" onClick={() => onChangePage(page - 1)} disabled={page <= 1} className="btn-secondary px-3 py-2 disabled:opacity-40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChangePage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                p === page
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-primary-50 hover:border-primary-200'
              }`}
            >
              {p}
            </button>
          ))}
          <button type="button" onClick={() => onChangePage(page + 1)} disabled={page >= totalPage} className="btn-secondary px-3 py-2 disabled:opacity-40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      <FullPageLoader open={load} />
    </div>
  );
};

export default AdminDashboard;
