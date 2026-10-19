import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState, invalidateBusCache } from '../../store';
import { busApi } from '../../services/apiService';
import { Bus } from '../../types/bus';
import { convertUtcToIst } from '../../utils/helpers';
import StatusBadge from '../common/StatusBadge';
import DeleteModal from '../modals/DeleteModal';

interface BusTableProps {
  data: Bus[];
  onRefresh?: () => void;
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

export const BusTable: React.FC<BusTableProps> = ({ data, onRefresh }) => {
  const navigate = useNavigate();
  const otherUserinfo = useSelector((state: RootState) => state.userAuth.otherUserinfo);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const isSuperAdmin = otherUserinfo?.role === '200';

  const handleDeleteConfirm = async () => {
    if (!deleteModal.id) return;
    try {
      const res = await busApi.delete(deleteModal.id);
      if (res?.statusCode === 200 || !res?.statusCode) {
        toast.success('Bus deleted successfully');
        invalidateBusCache();
        if (onRefresh) {
          onRefresh();
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete bus');
    } finally {
      setDeleteModal({ open: false, id: null });
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/80">
              <th className="py-2.5 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-10 text-center">#</th>
              <th className="py-2.5 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bus Details</th>
              <th className="py-2.5 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Capacity</th>
              <th className="py-2.5 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Route Info</th>
              <th className="py-2.5 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Registered On</th>
              <th className="py-2.5 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Status</th>
              <th className="py-2.5 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data?.length ? (
              data.map((item, ind) => {
                const startStation = item?.station_data?.[0]?.station || 'Origin';
                const endStation = item?.station_data?.[item?.station_data?.length - 1]?.station || 'Destination';
                const totalStops = item?.station_data?.length || 0;

                return (
                  <tr key={item._id || ind} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="py-3 px-3 text-center font-bold text-[11px] text-slate-400">
                      {ind + 1}
                    </td>

                    {/* Bus Name & Icon */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform duration-200 border border-blue-100/60">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                            {item?.bus_name}
                          </p>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {item?.email || 'fleet-operator'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Total Seats */}
                    <td className="py-3 px-3">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200/60">
                        <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{item?.Total_seat} Seats</span>
                      </div>
                    </td>

                    {/* Route Badge */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-0.5 max-w-xs">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-900 bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-200/70 w-fit">
                          <span>{startStation}</span>
                          <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                          <span>{endStation}</span>
                        </div>
                        {totalStops > 2 && (
                          <span className="text-[9px] text-slate-400 font-medium pl-0.5">
                            {totalStops} scheduled transit stops
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="py-3 px-3">
                      <div className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{convertUtcToIst(item?.createdAt)}</span>
                      </div>
                    </td>

                    {/* Current Status */}
                    <td className="py-3 px-3">
                      {isSuperAdmin ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/Buses/EditBus/${item?._id}`, { state: { data: item, type: 'edit' } })}
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                          title="Click to review/edit status"
                        >
                          <StatusBadge status={item?.status} />
                        </button>
                      ) : (
                        <StatusBadge status={item?.status} />
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-1">
                        {/* View Button */}
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/Buses/ViewBus/${item?._id}`, { state: { data: item, type: 'View_Bus' } })
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-all duration-150 active:scale-95 cursor-pointer"
                          title="View Details"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>View</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => navigate(`/Buses/EditBus/${item?._id}`, { state: { data: item, type: 'edit' } })}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-lg transition-all duration-150 active:scale-95 cursor-pointer"
                          title="Edit Bus"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeleteModal({ open: true, id: item?._id })}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-lg transition-all duration-150 active:scale-95 cursor-pointer"
                          title="Delete Bus"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <EmptyRow cols={7} />
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
