import React from 'react';
import { UserListItem } from '../../types/user';
import { convertUtcToIst2 } from '../../utils/helpers';

interface UserDetailModalProps {
  open: boolean;
  onClose: () => void;
  user: UserListItem | null;
  onEdit?: (user: UserListItem) => void;
  onToggleBlock?: (user: UserListItem) => void;
  isCurrentAdmin?: boolean;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  open,
  onClose,
  user,
  onEdit,
  onToggleBlock,
  isCurrentAdmin = false,
}) => {
  if (!open || !user) return null;

  const roleConfig = {
    NORMAL_USER: {
      label: 'Normal Passenger',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      avatarBg: 'bg-blue-600',
    },
    BUS_OWNER: {
      label: 'Bus Owner / Partner',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      avatarBg: 'bg-purple-600',
    },
    SUPER_ADMIN: {
      label: 'Super Administrator',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      avatarBg: 'bg-amber-600',
    },
  }[user.role] || {
    label: user.role,
    badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
    avatarBg: 'bg-slate-600',
  };

  const initial = user.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in border border-slate-100">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-6 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl ${roleConfig.avatarBg} text-white font-bold text-2xl flex items-center justify-center shadow-lg ring-4 ring-white/10`}
            >
              {initial}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${roleConfig.badgeClass} bg-white/95`}>
                  {roleConfig.label}
                </span>
              </div>
              <p className="text-sm text-blue-200 mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Status Bar */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Account Access</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    user.isBlocked
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${user.isBlocked ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}
                  />
                  {user.isBlocked ? 'Blocked / Suspended' : 'Active Account'}
                </span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email Verification</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    user.isEmailVerified
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {user.isEmailVerified ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856" />
                    )}
                  </svg>
                  {user.isEmailVerified ? 'Verified Email' : 'Unverified Email'}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">User Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-white rounded-xl border border-slate-100">
                <p className="text-xs text-slate-400 font-medium">User ID</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">#{user.id}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-100">
                <p className="text-xs text-slate-400 font-medium">Phone Number</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {user.phoneNumber || <span className="text-slate-400 italic">Not provided</span>}
                </p>
              </div>

              {user.role === 'BUS_OWNER' && (
                <div className="p-3 bg-white rounded-xl border border-slate-100 sm:col-span-2">
                  <p className="text-xs text-slate-400 font-medium">Bus Company / Agency Name</p>
                  <p className="text-sm font-semibold text-purple-700 mt-0.5 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    {user.companyName || <span className="text-slate-400 italic">No company registered</span>}
                  </p>
                </div>
              )}

              <div className="p-3 bg-white rounded-xl border border-slate-100">
                <p className="text-xs text-slate-400 font-medium">Registered Date</p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{convertUtcToIst2(user.createdAt)}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-100">
                <p className="text-xs text-slate-400 font-medium">Last Profile Update</p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{convertUtcToIst2(user.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 p-4 bg-slate-50 border-t border-slate-100">
          <div>
            {!isCurrentAdmin ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onToggleBlock) onToggleBlock(user);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  user.isBlocked
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {user.isBlocked ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  )}
                </svg>
                {user.isBlocked ? 'Unblock User' : 'Block User'}
              </button>
            ) : (
              <span className="text-[11px] text-slate-400 italic">Current logged in admin</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onEdit) onEdit(user);
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all"
            >
              Edit Details
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
