import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../store';
import { ROLES } from '../../utils/constants';
import AdminDashboard from './AdminDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';
import UserTable from '../../components/tables/UserTable';
import { useGetUserQuery } from '../../store/slices/userApiSlice';
import FullPageLoader from '../../components/common/FullPageLoader';

export const Dashboard: React.FC = () => {
  const { user, otherUserinfo } = useSelector((state: RootState) => state.userAuth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  const isSuperAdmin = otherUserinfo.role === ROLES.SUPER_ADMIN;
  const isAdmin = otherUserinfo.role === ROLES.ADMIN;

  // Handle nested User Management path
  if (location.pathname === '/Dashboard/ManageUsers') {
    if (!isSuperAdmin) {
      return <Navigate to="/Dashboard" replace />;
    }
    return <ManageUsersView />;
  }

  if (isSuperAdmin) {
    return <SuperAdminDashboard />;
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="page-container text-center py-12">
      <h1 className="text-xl font-semibold text-slate-800">Welcome</h1>
      <p className="text-slate-500 mt-2">Awaiting administrator role assignment...</p>
    </div>
  );
};

const ManageUsersView: React.FC = () => {
  const params = { page: 1, name: '', email: '' };
  const { data, isLoading, isFetching, error, refetch } = useGetUserQuery(params);
  const users = data?.data?.result || [];

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">User Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">View and manage registered users</p>
      </div>

      {error ? (
        <div className="card p-6 text-center">
          <div className="flex flex-col items-center gap-2 text-red-400">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm font-medium text-red-600">Failed to load users</p>
          </div>
        </div>
      ) : (
        <UserTable data={users} onRefresh={refetch} />
      )}

      <FullPageLoader open={isLoading || isFetching} />
    </div>
  );
};

export default Dashboard;
