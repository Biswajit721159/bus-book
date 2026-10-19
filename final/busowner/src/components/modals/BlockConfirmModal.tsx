import React from 'react';
import { UserListItem } from '../../types/user';

interface BlockConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: UserListItem | null;
  loading?: boolean;
}

export const BlockConfirmModal: React.FC<BlockConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  user,
  loading = false,
}) => {
  if (!open || !user) return null;

  const isBlocking = !user.isBlocked;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm overflow-hidden animate-fade-in border border-slate-100">
        <div
          className={`flex items-center justify-center w-14 h-14 rounded-2xl mx-auto mb-4 ${
            isBlocking ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
          }`}
        >
          {isBlocking ? (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 text-center mb-1">
          {isBlocking ? 'Block User Account?' : 'Unblock User Account?'}
        </h3>

        <p className="text-xs text-slate-500 text-center leading-relaxed mb-4">
          {isBlocking ? (
            <>
              Are you sure you want to block <strong className="text-slate-800 font-semibold">{user.name}</strong> ({user.email})?
              The user will be immediately rejected upon login and lose access to the platform.
            </>
          ) : (
            <>
              Are you sure you want to unblock <strong className="text-slate-800 font-semibold">{user.name}</strong> ({user.email})?
              The user will regain permission to log in and access their account.
            </>
          )}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-secondary flex-1 text-xs py-2.5 font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 text-xs py-2.5 font-bold rounded-xl text-white shadow-xs transition-all flex items-center justify-center gap-1.5 ${
              isBlocking
                ? 'bg-red-600 hover:bg-red-700 active:scale-95'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
            }`}
          >
            {loading && (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {isBlocking ? 'Yes, Block User' : 'Yes, Unblock User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockConfirmModal;
