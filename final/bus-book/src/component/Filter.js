import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BusTablemethod } from '../redux/BusSlice';

const filterGroups = [
  {
    label: 'Duration',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    options: [
      { key: 'DurationEarlyFirst', label: 'Shortest first' },
      { key: 'DurationLateFirst', label: 'Longest first' },
    ],
  },
  {
    label: 'Departure',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    options: [
      { key: 'DepartureEarlyFirst', label: 'Earliest first' },
      { key: 'DepartureLateFirst', label: 'Latest first' },
    ],
  },
  {
    label: 'Arrival',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    options: [
      { key: 'ArrivalEarlyFirst', label: 'Earliest first' },
      { key: 'ArrivalLateFirst', label: 'Latest first' },
    ],
  },
];

const Filter = () => {
  const dispatch = useDispatch();
  const { Bus } = useSelector((state) => state.Bus);
  const [active, setActive] = useState(null);

  const applyFilter = (key) => {
    const next = active === key ? null : key;
    setActive(next);
    if (next) dispatch(BusTablemethod[next](Bus));
  };

  return (
    <div className="bg-white border-b border-surface-200 sticky top-16 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2.5">
          {/* Label */}
          <div className="flex items-center gap-1.5 flex-shrink-0 pr-3 border-r border-surface-200 mr-1">
            <svg className="w-3.5 h-3.5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider whitespace-nowrap">
              Sort
            </span>
          </div>

          {/* Filter groups */}
          {filterGroups.map((group) => (
            <div key={group.label} className="flex items-center gap-1 flex-shrink-0">
              <span className="flex items-center gap-1 text-xs text-surface-400 mr-0.5">
                {group.icon}
                <span className="hidden sm:inline font-medium">{group.label}:</span>
              </span>
              {group.options.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => applyFilter(opt.key)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 border ${
                    active === opt.key
                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                      : 'bg-white text-surface-600 border-surface-200 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {active === opt.key && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {opt.label}
                </button>
              ))}
            </div>
          ))}

          {/* Separator + Clear */}
          {active && (
            <>
              <div className="w-px h-5 bg-surface-200 flex-shrink-0 mx-1" />
              <button
                onClick={() => setActive(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-all duration-150 whitespace-nowrap flex-shrink-0"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear filter
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;
