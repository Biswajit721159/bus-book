import React, { useState } from 'react';
import { Booking } from '../../../types/booking';

interface BusSeatMapProps {
  totalSeats: number;
  bookings: Booking[];
  onSeatClick: (booking: Booking) => void;
}

interface SeatInfo {
  seatNumber: string;
  isBooked: boolean;
  passengerName?: string;
  booking?: Booking;
  route?: string;
  isCancelled?: boolean;
}

export const BusSeatMap: React.FC<BusSeatMapProps> = ({
  totalSeats,
  bookings,
  onSeatClick,
}) => {
  const [hoveredSeat, setHoveredSeat] = useState<SeatInfo | null>(null);

  // Build a fast lookup map for seats
  const seatMap = new Map<string, { booking: Booking; passenger: string; isCancelled: boolean }>();

  bookings.forEach((b) => {
    (b.seat_record || []).forEach((seatNum, idx) => {
      const cleanNum = String(seatNum).trim();
      const isCancelled = b.status?.[idx] === false;
      const passenger = b.person?.[idx] || 'Passenger';
      seatMap.set(cleanNum, {
        booking: b,
        passenger,
        isCancelled,
      });
    });
  });

  const seatCount = totalSeats > 0 ? totalSeats : 40;
  const seats: SeatInfo[] = [];

  for (let i = 1; i <= seatCount; i++) {
    const seatId = String(i);
    const bookingInfo = seatMap.get(seatId);

    if (bookingInfo) {
      seats.push({
        seatNumber: seatId,
        isBooked: !bookingInfo.isCancelled,
        passengerName: bookingInfo.passenger,
        booking: bookingInfo.booking,
        route: `${bookingInfo.booking.src} → ${bookingInfo.booking.dist}`,
        isCancelled: bookingInfo.isCancelled,
      });
    } else {
      seats.push({
        seatNumber: seatId,
        isBooked: false,
      });
    }
  }

  // Calculate stats
  const totalBooked = seats.filter((s) => s.isBooked).length;
  const totalAvailable = seatCount - totalBooked;
  const occupancyPercent = Math.round((totalBooked / seatCount) * 100);

  // Group into rows of 4 (2 on left, aisle, 2 on right)
  const rows: SeatInfo[][] = [];
  for (let i = 0; i < seats.length; i += 4) {
    rows.push(seats.slice(i, i + 4));
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.06)] p-5 animate-fade-in space-y-6">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Interactive Bus Floor Plan</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              2+2 Layout
            </span>
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Click any reserved seat to inspect passenger ticket and status
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-50 border-2 border-emerald-500 shadow-xs" />
            <span className="text-slate-600 text-[11px]">Available ({totalAvailable})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-indigo-600 border border-indigo-700 shadow-xs" />
            <span className="text-slate-600 text-[11px]">Booked ({totalBooked})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-rose-100 border border-rose-300 shadow-xs" />
            <span className="text-slate-600 text-[11px]">Cancelled</span>
          </div>
          <div className="pl-2 border-l border-slate-200">
            <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              {occupancyPercent}% Occupied
            </span>
          </div>
        </div>
      </div>

      {/* Bus Chassis Visualizer */}
      <div className="max-w-md mx-auto relative bg-slate-50/70 border-2 border-slate-300 rounded-3xl p-5 shadow-inner">
        {/* Front Windshield / Driver Cabin */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-slate-200 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center font-bold shadow-xs">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Cabin Front</span>
              <span className="text-xs font-bold text-slate-700">Driver Console</span>
            </div>
          </div>
          <div className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-500 shadow-xs">
            🚪 Entry Gate
          </div>
        </div>

        {/* Seat Rows Grid */}
        <div className="space-y-3">
          {rows.map((row, rIdx) => {
            const leftSeats = row.slice(0, 2);
            const rightSeats = row.slice(2, 4);

            return (
              <div key={rIdx} className="flex items-center justify-between gap-3">
                {/* Left 2 Seats */}
                <div className="flex items-center gap-2">
                  {leftSeats.map((seat) => (
                    <SeatButton
                      key={seat.seatNumber}
                      seat={seat}
                      onSeatClick={onSeatClick}
                      onHover={setHoveredSeat}
                    />
                  ))}
                  {leftSeats.length === 1 && <div className="w-12 h-12" />}
                </div>

                {/* Central Aisle */}
                <div className="flex-1 flex justify-center">
                  <div className="w-6 h-8 flex items-center justify-center text-[10px] font-bold text-slate-300">
                    · ·
                  </div>
                </div>

                {/* Right 2 Seats */}
                <div className="flex items-center gap-2">
                  {rightSeats.map((seat) => (
                    <SeatButton
                      key={seat.seatNumber}
                      seat={seat}
                      onSeatClick={onSeatClick}
                      onHover={setHoveredSeat}
                    />
                  ))}
                  {rightSeats.length === 1 && <div className="w-12 h-12" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rear of the Bus */}
        <div className="mt-5 pt-3 border-t-2 border-dashed border-slate-200 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Rear of Coach
          </span>
        </div>
      </div>

      {/* Floating Hover Details Card */}
      {hoveredSeat && (
        <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg text-xs max-w-sm mx-auto flex items-center justify-between animate-fade-in">
          <div>
            <p className="font-extrabold text-blue-300">Seat #{hoveredSeat.seatNumber}</p>
            {hoveredSeat.isBooked ? (
              <>
                <p className="font-bold text-white">{hoveredSeat.passengerName}</p>
                <p className="text-[10px] text-slate-400">{hoveredSeat.route}</p>
              </>
            ) : (
              <p className="text-emerald-400 font-medium">Available for booking</p>
            )}
          </div>
          {hoveredSeat.isBooked && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Reserved
            </span>
          )}
        </div>
      )}
    </div>
  );
};

interface SeatButtonProps {
  seat: SeatInfo;
  onSeatClick: (booking: Booking) => void;
  onHover: (seat: SeatInfo | null) => void;
}

const SeatButton: React.FC<SeatButtonProps> = ({ seat, onSeatClick, onHover }) => {
  const isBooked = seat.isBooked;
  const isCancelled = seat.isCancelled;

  const handleClick = () => {
    if (isBooked && seat.booking) {
      onSeatClick(seat.booking);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => onHover(seat)}
      onMouseLeave={() => onHover(null)}
      className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-150 relative cursor-pointer group ${
        isBooked
          ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:scale-105 active:scale-95'
          : isCancelled
          ? 'bg-rose-50 border border-rose-200 text-rose-500'
          : 'bg-white border-2 border-emerald-400/80 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-500 hover:scale-105 active:scale-95 shadow-xs'
      }`}
      title={isBooked ? `${seat.seatNumber}: ${seat.passengerName}` : `Seat ${seat.seatNumber} Available`}
    >
      <span className="text-[11px] font-black leading-tight">
        {seat.seatNumber}
      </span>
      <span className="text-[8px] font-extrabold uppercase tracking-tighter opacity-80 leading-none mt-0.5">
        {isBooked ? 'Booked' : 'Free'}
      </span>

      {/* Mini top cushion indicator */}
      <span
        className={`absolute -top-1 w-6 h-1 rounded-full ${
          isBooked ? 'bg-indigo-400' : 'bg-emerald-300'
        }`}
      />
    </button>
  );
};

export default BusSeatMap;
