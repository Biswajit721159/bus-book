import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ROLES } from '../../utils/constants';
import AdminBookings from './AdminBookings';
import SuperAdminBookings from './SuperAdminBookings';

export const Bookings: React.FC = () => {
  const { otherUserinfo } = useSelector((state: RootState) => state.userAuth);

  if (otherUserinfo.role === ROLES.SUPER_ADMIN) {
    return <SuperAdminBookings />;
  }

  return <AdminBookings />;
};

export default Bookings;
