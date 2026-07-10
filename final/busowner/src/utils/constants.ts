export const API_BASE_URL = process.env.REACT_APP_API_JAVA ? `${process.env.REACT_APP_API_JAVA}/api` : (process.env.REACT_APP_API || 'http://localhost:5000/api');

export const ROLES = {
  ADMIN: '100',
  SUPER_ADMIN: '200',
} as const;

export const BUS_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const STATUS_OPTIONS = [
  {
    value: BUS_STATUS.PENDING,
    label: 'Pending',
    activeCls: 'border-transparent text-white bg-amber-500',
    dotActive: 'bg-white',
    dotInactive: 'bg-amber-500',
  },
  {
    value: BUS_STATUS.APPROVED,
    label: 'Approved',
    activeCls: 'border-transparent text-white bg-emerald-500',
    dotActive: 'bg-white',
    dotInactive: 'bg-emerald-500',
  },
  {
    value: BUS_STATUS.REJECTED,
    label: 'Rejected',
    activeCls: 'border-transparent text-white bg-red-500',
    dotActive: 'bg-white',
    dotInactive: 'bg-red-500',
  },
];
