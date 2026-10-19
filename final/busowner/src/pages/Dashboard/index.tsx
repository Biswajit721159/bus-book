import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../store';
import { ROLES } from '../../utils/constants';
import AdminDashboard from './AdminDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';
import ManageUsersPage from '../ManageUsers';

export const Dashboard: React.FC = () => {
  const { user, otherUserinfo } = useSelector((state: RootState) => state.userAuth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  const isSuperAdmin = otherUserinfo.role === ROLES.SUPER_ADMIN;
  const isAdmin = otherUserinfo.role === ROLES.ADMIN;

  // Handle nested User Management path
  if (location.pathname === '/Dashboard/ManageUsers' || location.pathname === '/ManageUsers') {
    if (!isSuperAdmin) {
      return <Navigate to="/Dashboard" replace />;
    }
    return <ManageUsersPage />;
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

export default Dashboard;
