import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Booking } from '../../types/booking';
import { convertUtcToIst } from '../../utils/helpers';
import PassengerModal from '../modals/PassengerModal';

interface BookingTableProps {
  data: Booking[];
}

export const BookingTable: React.FC<BookingTableProps> = ({ data }) => {
  const [modal, setModal] = useState<{ open: boolean; data: Booking | null }>({
    open: false,
    data: null,
  });
  const navigate = useNavigate();

  if (!data?.length) {
    return (
      <div className="card p-12 text-center mt-4">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-sm font-medium">No bookings found</p>
          <p className="text-xs">Try adjusting your search filters</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card overflow-hidden bg-white shadow-sm rounded-2xl border border-slate-100 mt-6">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Booking ID / Email</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamps</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Bus</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Route</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Journey Date</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Payment</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Distance</th>
                <th className="px-5 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Passengers</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item._id || index} className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors">
                  <td className="px-5 py-4">
                    <span className="bg-slate-50 text-slate-600 border border-slate-100 px-2 py-0.5 rounded-md font-mono text-[9px] tracking-tight">{item._id}</span>
                    <p className="text-xs text-primary-600 font-semibold mt-1">{item.useremail}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[10px] text-slate-400">
                      <span className="font-bold uppercase tracking-wider text-[8px] text-slate-400 mr-1">Created:</span>{' '}
                      {convertUtcToIst(item.createdAt)}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      <span className="font-bold uppercase tracking-wider text-[8px] text-slate-400 mr-1">Updated:</span>{' '}
                      {convertUtcToIst(item.updatedAt)}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => navigate(`/Buses/ViewBus/${item?.bus_id}`)}
                      className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-semibold text-sm hover:underline transition-colors"
                    >
                      <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      {item?.bus?.bus_name || 'View Bus'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 text-sm">{item.src}</span>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                        <div className="w-6 border-t border-dashed border-slate-200" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="font-semibold text-slate-800 text-sm">{item.dist}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 text-sm font-semibold">{convertUtcToIst(item.date)}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-bold text-slate-900 text-base">₹{item.total_money}</span>
                      <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">Paid</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-sm font-semibold">{item.total_distance} km</td>
                  <td className="px-5 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => setModal({ open: true, data: item })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 hover:border-amber-300 transition-all active:scale-95"
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
                      View Seats
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PassengerModal
        open={modal.open}
        onClose={() => setModal({ open: false, data: null })}
        bookingData={modal.data}
      />
    </>
  );
};

export default BookingTable;
