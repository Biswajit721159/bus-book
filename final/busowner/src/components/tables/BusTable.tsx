import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Bus } from '../../types/bus';
import { convertUtcToIst } from '../../utils/helpers';
import StatusBadge from '../common/StatusBadge';
import DeleteModal from '../modals/DeleteModal';

interface BusTableProps {
  data: Bus[];
}

const EmptyRow: React.FC<{ cols: number }> = ({ cols }) => (
  <tr>
    <td colSpan={cols} className="px-4 py-12 text-center">
      <div className="flex flex-col items-center gap-2 text-slate-400">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-sm font-medium">No buses found</span>
      </div>
    </td>
  </tr>
);

export const BusTable: React.FC<BusTableProps> = ({ data }) => {
  const navigate = useNavigate();
  const otherUserinfo = useSelector((state: RootState) => state.userAuth.otherUserinfo);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const isSuperAdmin = otherUserinfo?.role === '200';

  const handleDeleteConfirm = () => {
    // API deletion logic placeholder (replicating original structure behavior)
    setDeleteModal({ open: false, id: null });
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-10">#</th>
              <th>Bus Name</th>
              <th>Total Seats</th>
              <th>Route</th>
              <th>Created At</th>
              {isSuperAdmin && <th>Status</th>}
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.length ? (
              data.map((item, ind) => (
                <tr key={item._id || ind}>
                  <td className="text-slate-400 font-medium">{ind + 1}</td>
                  <td>
                    <span className="font-medium text-slate-800">{item?.bus_name}</span>
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <svg
                        className="w-3.5 h-3.5 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {item?.Total_seat}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                      {item?.station_data?.[0]?.station || '—'} →{' '}
                      {item?.station_data?.[item?.station_data?.length - 1]?.station || '—'}
                    </span>
                  </td>
                  <td className="text-slate-500 text-xs">{convertUtcToIst(item?.createdAt)}</td>
                  {isSuperAdmin && (
                    <td>
                      <button
                        type="button"
                        onClick={() => navigate('/Buses/EditBus', { state: { data: item, type: 'edit' } })}
                      >
                        <StatusBadge status={item?.status} />
                      </button>
                    </td>
                  )}
                  <td>
                    <div className="flex items-center justify-center gap-1.5">
                      {/* View */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/Buses/ViewBus/${item?._id}`, { state: { data: item, type: 'View_Bus' } })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                        title="View"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View
                      </button>
                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => navigate('/Buses/EditBus', { state: { data: item, type: 'edit' } })}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors"
                        title="Edit"
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
                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setDeleteModal({ open: true, id: item?._id })}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <EmptyRow cols={isSuperAdmin ? 7 : 6} />
            )}
          </tbody>
        </table>
      </div>

      <DeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Bus"
        description="Are you sure you want to delete this bus? This action cannot be undone."
      />
    </>
  );
};

export default BusTable;
