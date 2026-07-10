import React from 'react';
import AdminDashboard from '../Dashboard/AdminDashboard';
import SuperAdminDashboard from '../Dashboard/SuperAdminDashboard';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ROLES } from '../../utils/constants';

export const Buses: React.FC = () => {
  const { otherUserinfo } = useSelector((state: RootState) => state.userAuth);
  
  if (otherUserinfo.role === ROLES.SUPER_ADMIN) {
    return <SuperAdminDashboard />;
  }

  return <AdminDashboard />;
};

export default Buses;
