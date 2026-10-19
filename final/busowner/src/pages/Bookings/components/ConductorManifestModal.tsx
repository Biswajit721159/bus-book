import React from 'react';
import { Booking } from '../../../types/booking';

interface ConductorManifestModalProps {
  open: boolean;
  onClose: () => void;
  busName: string;
  journeyDate: string;
  bookings: Booking[];
}

export const ConductorManifestModal: React.FC<ConductorManifestModalProps> = ({
  open,
  onClose,
  busName,
  journeyDate,
  bookings,
}) => {
  if (!open) return null;

  // Flatten passengers across all bookings
  const manifestRows: {
    seatNumber: string;
    passengerName: string;
    pnr: string;
    source: string;
    destination: string;
    fare: number;
    bookingId: string;
  }[] = [];

  bookings.forEach((b) => {
    (b.seat_record || []).forEach((seatNum, idx) => {
      if (b.status?.[idx] !== false) {
        manifestRows.push({
          seatNumber: String(seatNum),
          passengerName: b.person?.[idx] || 'Passenger',
          pnr: b.pnr_number || '—',
          source: b.src || '—',
          destination: b.dist || '—',
          fare: Math.round((b.total_money || 0) / (b.seat_record?.length || 1)),
          bookingId: b._id,
        });
      }
    });
  });

  // Sort seats numerically
  manifestRows.sort((a, b) => {
    const numA = parseInt(a.seatNumber, 10);
    const numB = parseInt(b.seatNumber, 10);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.seatNumber.localeCompare(b.seatNumber);
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
              Conductor Boarding Manifest
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              {busName} Passenger Manifest
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Departure Date: <span className="font-bold text-slate-800">{journeyDate}</span> · {manifestRows.length} Confirmed Passengers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print Manifest</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 print:p-0">
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3 text-center w-12">Seat</th>
                  <th className="py-2.5 px-3">Passenger Name</th>
                  <th className="py-2.5 px-3">PNR / Ticket</th>
                  <th className="py-2.5 px-3">Boarding Point</th>
                  <th className="py-2.5 px-3">Drop Point</th>
                  <th className="py-2.5 px-3">Fare</th>
                  <th className="py-2.5 px-3 text-center w-20">Boarded?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {manifestRows.length > 0 ? (
                  manifestRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-center font-black text-indigo-700 bg-indigo-50/50">
                        {row.seatNumber}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">
                        {row.passengerName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px] font-bold">
                        {row.pnr}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">
                        {row.source}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">
                        {row.destination}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        ₹{row.fare}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No confirmed passenger seats found for this departure.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConductorManifestModal;
