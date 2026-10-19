import React from 'react';
import { Booking } from '../../types/booking';

interface PassengerModalProps {
  open: boolean;
  onClose: () => void;
  bookingData: Partial<Booking> | null;
}

export const PassengerModal: React.FC<PassengerModalProps> = ({ open, onClose, bookingData }) => {
  if (!open || !bookingData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
              Ticket Reservation Details
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mt-1">
              Booking #{bookingData._id || ''}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Ticket Overview Banner */}
        <div className="p-5 bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-white border-b border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase">PNR:</span>
              <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-xs">
                {bookingData.pnr_number || 'PENDING'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Fare:</span>
              <span className="font-extrabold text-sm text-slate-900">
                ₹{bookingData.total_money?.toLocaleString('en-IN') || 0}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
            <span className="text-blue-600">{bookingData.src || 'Origin'}</span>
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span className="text-indigo-600">{bookingData.dist || 'Destination'}</span>
          </div>
        </div>

        {/* Passenger Seats List */}
        <div className="p-5 space-y-2.5 max-h-80 overflow-y-auto">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Reserved Passengers ({bookingData.seat_record?.length || 0})
          </p>

          {bookingData?.seat_record?.length ? (
            bookingData.seat_record.map((seat, index) => {
              const isConfirmed = bookingData.status?.[index] !== false;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl hover:bg-blue-50/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                      {seat}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">
                        {bookingData.person?.[index] || `Passenger #${index + 1}`}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Seat Berth {seat}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border shadow-2xs uppercase tracking-wider ${
                      isConfirmed
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {isConfirmed ? 'Confirmed' : 'Cancelled'}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-xs text-slate-400 font-medium">No seat reservation details recorded.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassengerModal;
