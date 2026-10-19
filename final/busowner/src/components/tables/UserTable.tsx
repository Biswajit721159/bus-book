import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../../store';
import { UserListItem, UserRole } from '../../types/user';
import { convertUtcToIst2 } from '../../utils/helpers';
import {
  useToggleBlockUserMutation,
  useUpdateUserByAdminMutation,
  useDeleteUserByAdminMutation,
} from '../../store/slices/userApiSlice';
import UserDetailModal from '../modals/UserDetailModal';
import UserEditModal from '../modals/UserEditModal';
import BlockConfirmModal from '../modals/BlockConfirmModal';
import DeleteModal from '../modals/DeleteModal';

interface UserTableProps {
  data: UserListItem[];
  onRefresh?: () => void;
}

export const UserTable: React.FC<UserTableProps> = ({ data, onRefresh }) => {
  const { user: authUser } = useSelector((state: RootState) => state.userAuth);
  const currentAdminEmail = authUser?.user?.email?.toLowerCase();

  // RTK Mutations
  const [toggleBlockUser, { isLoading: isBlocking }] = useToggleBlockUserMutation();
  const [updateUserByAdmin, { isLoading: isUpdating }] = useUpdateUserByAdminMutation();
  const [deleteUserByAdmin] = useDeleteUserByAdminMutation();

  // Modals state
  const [detailUser, setDetailUser] = useState<UserListItem | null>(null);
  const [editUser, setEditUser] = useState<UserListItem | null>(null);
  const [blockUser, setBlockUser] = useState<UserListItem | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserListItem | null>(null);

  const handleToggleBlockConfirm = async () => {
    if (!blockUser) return;
    try {
      await toggleBlockUser(blockUser.id).unwrap();
      const action = blockUser.isBlocked ? 'unblocked' : 'blocked';
      toast.success(`User ${blockUser.name} has been ${action} successfully`);
      setBlockUser(null);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to update user block status');
    }
  };

  const handleUpdateSave = async (
    id: number,
    formData: { name: string; phoneNumber?: string; companyName?: string; role?: UserRole }
  ) => {
    try {
      await updateUserByAdmin({ id, data: formData }).unwrap();
      toast.success('User profile updated successfully');
      setEditUser(null);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to update user');
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUser) return;
    try {
      await deleteUserByAdmin(deleteUser.id).unwrap();
      toast.success(`User ${deleteUser.name} permanently deleted`);
      setDeleteUser(null);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to delete user');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'NORMAL_USER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
            <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Passenger
          </span>
        );
      case 'BUS_OWNER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
            <svg className="w-3 h-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Bus Owner
          </span>
        );
      case 'SUPER_ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
            <svg className="w-3 h-3 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Super Admin
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
            {role}
          </span>
        );
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="data-table w-full text-left">
          <thead>
            <tr>
              <th className="w-12 text-center">#</th>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Contact & Company</th>
              <th>Registered</th>
              <th className="text-center w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data?.length ? (
              data.map((user, index) => {
                const isSelf = Boolean(currentAdminEmail && user.email?.toLowerCase() === currentAdminEmail);

                return (
                  <tr key={user.id || user.email || index} className="hover:bg-slate-50/70 transition-colors">
                    <td className="text-center text-slate-400 font-medium text-xs">
                      {index + 1}
                    </td>

                    {/* User info */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs shadow-xs ${
                            user.role === 'SUPER_ADMIN'
                              ? 'bg-amber-100 text-amber-800'
                              : user.role === 'BUS_OWNER'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {user.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900 text-sm truncate max-w-[180px]">
                              {user.name}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 truncate block max-w-[200px]">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role badge */}
                    <td>{getRoleBadge(user.role)}</td>

                    {/* Status badge */}
                    <td>
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            user.isBlocked
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.isBlocked ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'
                            }`}
                          />
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                        {user.isEmailVerified ? (
                          <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Verified
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-amber-600 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                            </svg>
                            Unverified
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Contact & Company */}
                    <td>
                      <div className="text-xs space-y-0.5">
                        {user.companyName ? (
                          <p className="font-semibold text-slate-800 flex items-center gap-1 truncate max-w-[170px]" title={user.companyName}>
                            <svg className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {user.companyName}
                          </p>
                        ) : null}
                        <p className="text-slate-500 flex items-center gap-1">
                          {user.phoneNumber ? (
                            <>
                              <svg className="w-3 h-3 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {user.phoneNumber}
                            </>
                          ) : (
                            <span className="text-slate-400 italic">No phone</span>
                          )}
                        </p>
                      </div>
                    </td>

                    {/* Registration date */}
                    <td className="text-slate-500 text-xs whitespace-nowrap">
                      {convertUtcToIst2(user.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => setDetailUser(user)}
                          title="View Details"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {/* Edit User */}
                        <button
                          type="button"
                          onClick={() => setEditUser(user)}
                          title="Edit User"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 border border-slate-200 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Block / Unblock Toggle */}
                        <button
                          type="button"
                          onClick={() => setBlockUser(user)}
                          disabled={isSelf}
                          title={
                            isSelf
                              ? 'Cannot block yourself'
                              : user.isBlocked
                              ? 'Unblock User'
                              : 'Block User'
                          }
                          className={`p-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                            user.isBlocked
                              ? 'text-emerald-600 hover:bg-emerald-50 border-emerald-200 bg-emerald-50/50'
                              : 'text-red-600 hover:bg-red-50 border-red-200 bg-red-50/50'
                          }`}
                        >
                          {user.isBlocked ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          )}
                        </button>

                        {/* Delete User */}
                        <button
                          type="button"
                          onClick={() => setDeleteUser(user)}
                          disabled={isSelf}
                          title={isSelf ? 'Cannot delete yourself' : 'Delete User'}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400 max-w-sm mx-auto">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-700">No users found</h4>
                      <p className="text-xs text-slate-500 mt-1">Try modifying your search or filter settings to find users.</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <UserDetailModal
        open={Boolean(detailUser)}
        onClose={() => setDetailUser(null)}
        user={detailUser}
        onEdit={(u) => setEditUser(u)}
        onToggleBlock={(u) => setBlockUser(u)}
        isCurrentAdmin={Boolean(currentAdminEmail && detailUser?.email?.toLowerCase() === currentAdminEmail)}
      />

      <UserEditModal
        open={Boolean(editUser)}
        onClose={() => setEditUser(null)}
        user={editUser}
        onSave={handleUpdateSave}
        loading={isUpdating}
      />

      <BlockConfirmModal
        open={Boolean(blockUser)}
        onClose={() => setBlockUser(null)}
        onConfirm={handleToggleBlockConfirm}
        user={blockUser}
        loading={isBlocking}
      />

      <DeleteModal
        open={Boolean(deleteUser)}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete User Permanently"
        description={
          deleteUser
            ? `Are you sure you want to permanently delete user "${deleteUser.name}" (${deleteUser.email})? This action cannot be undone.`
            : 'Are you sure you want to delete this user?'
        }
      />
    </>
  );
};

export default UserTable;
