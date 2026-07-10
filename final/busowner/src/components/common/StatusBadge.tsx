import React from 'react';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const map: Record<string, string> = {
    pending: 'badge-pending',
    approved: 'badge-approved',
    rejected: 'badge-rejected',
  };

  return (
    <span className={map[status] || 'badge-pending'}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending'}
    </span>
  );
};

export default StatusBadge;
