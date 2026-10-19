import React, { useState, useRef, useEffect } from 'react';
import Portal from '../common/Portal';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface CalendarPickerProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  minDate?: string;
  error?: string;
  className?: string;
  containerCls?: string;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  value,
  onChange,
  label = 'Journey Date',
  minDate,
  error,
  className = '',
  containerCls = '',
}) => {
  const [open, setOpen] = useState(false);
  const [viewYear, setVY] = useState(() =>
    value ? parseInt(value.split('-')[0], 10) : new Date().getFullYear()
  );
  const [viewMonth, setVM] = useState(() =>
    value ? parseInt(value.split('-')[1], 10) - 1 : new Date().getMonth()
  );
  const [mode, setMode] = useState<'day' | 'month' | 'year'>('day');

  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const minBoundary = minDate ? new Date(minDate + 'T00:00:00') : today;

  // Sync internal view with value when value changes
  useEffect(() => {
    if (value) {
      setVY(parseInt(value.split('-')[0], 10));
      setVM(parseInt(value.split('-')[1], 10) - 1);
    }
  }, [value]);

  // Handle outside clicks to close panel
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      if ((e.target as HTMLElement).closest('[data-cal-panel]')) return;
      setOpen(false);
      setMode('day');
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const toStr = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const isPast = (y: number, m: number, d: number) => {
    const t = new Date(y, m, d);
    t.setHours(0, 0, 0, 0);
    return t < minBoundary;
  };

  const isSelected = (y: number, m: number, d: number) => value === toStr(y, m, d);
  const isToday = (y: number, m: number, d: number) => todayStr === toStr(y, m, d);

  const selectDay = (d: number) => {
    if (isPast(viewYear, viewMonth, d)) return;
    onChange(toStr(viewYear, viewMonth, d));
    setOpen(false);
    setMode('day');
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setVM(11);
      setVY((y) => y - 1);
    } else {
      setVM((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setVM(0);
      setVY((y) => y + 1);
    } else {
      setVM((m) => m + 1);
    }
  };

  const displayDateObj = value ? new Date(value + 'T00:00:00') : null;
  const displayFormatted = displayDateObj
    ? displayDateObj.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  const displayWeekday = displayDateObj
    ? displayDateObj.toLocaleDateString('en-IN', { weekday: 'short' })
    : '';

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => currentYear - 1 + i);

  const totalDays = daysInMonth(viewYear, viewMonth);
  const startDay = firstDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div ref={containerRef} className={`w-full ${containerCls}`}>
      {label && (
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
          {label} <span className="text-rose-500">*</span>
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border rounded-xl transition-all duration-150 text-left cursor-pointer ${
          open
            ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white'
            : 'border-slate-200 hover:border-slate-300'
        } ${error ? 'border-rose-400 ring-2 ring-rose-400/20' : ''} ${className}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="truncate">
            {displayFormatted ? (
              <span className="font-extrabold text-slate-900">
                {displayFormatted}
                <span className="ml-1 text-[10px] text-blue-600 font-semibold uppercase">
                  ({displayWeekday})
                </span>
              </span>
            ) : (
              <span className="text-slate-400 font-normal">Choose departure date</span>
            )}
          </div>
        </div>

        <svg
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            open ? 'rotate-180 text-blue-600' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Floating Popover Panel */}
      <Portal triggerRef={triggerRef} open={open} minWidth={310}>
        <div
          data-cal-panel="true"
          className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)] overflow-hidden select-none animate-slide-up"
          style={{ width: 310 }}
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-3.5 text-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                Departure Date
              </span>
              <button
                type="button"
                onClick={() => {
                  onChange(todayStr);
                  setOpen(false);
                }}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
              >
                Today
              </button>
            </div>
            <p className="text-sm font-black text-white mt-1">
              {displayFormatted ? `${displayFormatted} (${displayWeekday})` : 'Select a Date'}
            </p>
          </div>

          {/* Month / Year Navigator */}
          <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <button
              type="button"
              onClick={prevMonth}
              className="w-7 h-7 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-none hover:shadow-sm"
              title="Previous Month"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMode(mode === 'month' ? 'day' : 'month')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  mode === 'month' ? 'bg-blue-600 text-white' : 'text-slate-800 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                {MONTHS[viewMonth]}
              </button>
              <button
                type="button"
                onClick={() => setMode(mode === 'year' ? 'day' : 'year')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  mode === 'year' ? 'bg-blue-600 text-white' : 'text-slate-800 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                {viewYear}
              </button>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="w-7 h-7 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-none hover:shadow-sm"
              title="Next Month"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Month Selector Grid */}
          {mode === 'month' && (
            <div className="p-3 grid grid-cols-3 gap-1.5">
              {MONTHS.map((m, idx) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setVM(idx);
                    setMode('day');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    viewMonth === idx
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
          )}

          {/* Year Selector Grid */}
          {mode === 'year' && (
            <div className="p-3 grid grid-cols-3 gap-1.5 max-h-52 overflow-y-auto">
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => {
                    setVY(y);
                    setMode('day');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    viewYear === y
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {/* Day Grid */}
          {mode === 'day' && (
            <div className="p-3">
              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-1.5 text-center">
                {DAYS.map((d) => (
                  <span key={d} className="text-[10px] font-bold text-slate-400 py-0.5">
                    {d}
                  </span>
                ))}
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-1">
                {cells.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} className="h-7 w-7" />;
                  const past = isPast(viewYear, viewMonth, day);
                  const sel = isSelected(viewYear, viewMonth, day);
                  const tod = isToday(viewYear, viewMonth, day);

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={past}
                      onClick={() => selectDay(day)}
                      className={`h-7 w-full rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                        past
                          ? 'text-slate-300 cursor-not-allowed bg-transparent'
                          : sel
                          ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                          : tod
                          ? 'bg-blue-50 text-blue-700 font-extrabold border border-blue-200'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    const tom = new Date();
                    tom.setDate(tom.getDate() + 1);
                    onChange(tom.toISOString().split('T')[0]);
                    setOpen(false);
                  }}
                  className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  + Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </Portal>
    </div>
  );
};

export default CalendarPicker;
