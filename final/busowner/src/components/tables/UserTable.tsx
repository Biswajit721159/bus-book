import React, { useState } from 'react';
import { convertUtcToIst2 } from '../../utils/helpers';
import { toast } from 'react-toastify';
import InputField from '../forms/InputField';
import { request } from '../../services/api/client';

interface UserListItem {
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface UserTableProps {
  data: UserListItem[];
  onRefresh?: () => void;
}

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  user: { name: string; email: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ open, onClose, user, onChange, onSave }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-sm animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Edit User</h3>
          <button onClick={onClose} className="btn-icon text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5 space-y-4">
          <InputField label="Email Address" type="email" name="email" value={user.email} disabled />
          <InputField
            label="Full Name"
            type="text"
            name="name"
            value={user.name}
            onChange={onChange}
            placeholder="Enter full name"
            autoFocus
          />
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={onSave} className="btn-primary flex-1">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export const UserTable: React.FC<UserTableProps> = ({ data, onRefresh }) => {
  const [editModal, setEditModal] = useState<{ open: boolean; user: { name: string; email: string } }>({
    open: false,
    user: { name: '', email: '' },
  });

  const handleEdit = (user: UserListItem) => {
    setEditModal({ open: true, user: { name: user.name, email: user.email } });
  };

  const handleClose = () => {
    setEditModal({ open: false, user: { name: '', email: '' } });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditModal((prev) => ({ ...prev, user: { ...prev.user, [name]: value } }));
  };

  const handleSave = async () => {
    try {
      await request('user/updateUser', {
        method: 'PUT',
        body: {
          email: editModal.user.email,
          name: editModal.user.name,
        },
      });
      toast.success('User updated successfully');
      handleClose();
      if (onRefresh) onRefresh();
    } catch (e: any) {
      toast.warn(e?.message || 'Failed to update user');
    }
  };

  return (
    <>
      <div className="card overflow-hidden">
        <div className="card-header">
          <h2 className="section-title">Registered Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Registered</th>
                <th>Last Updated</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.length ? (
                data.map((user, index) => (
                  <tr key={user.email || index}>
                    <td className="text-slate-400 font-medium">{index + 1}</td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-primary-700">
                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <span className="font-medium text-slate-800">{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-primary-600 text-sm">{user.email}</span>
                    </td>
                    <td className="text-slate-500 text-xs">{convertUtcToIst2(user.createdAt)}</td>
                    <td className="text-slate-500 text-xs">{convertUtcToIst2(user.updatedAt)}</td>
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => handleEdit(user)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium">No users found</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditModal
        open={editModal.open}
        onClose={handleClose}
        user={editModal.user}
        onChange={handleChange}
        onSave={handleSave}
      />
    </>
  );
};

export default UserTable;
