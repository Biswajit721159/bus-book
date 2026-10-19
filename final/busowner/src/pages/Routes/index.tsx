import React, { useEffect, useState, useMemo } from 'react';
import { busApi } from '../../services/apiService';
import { Bus } from '../../types/bus';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';
import { toast } from 'react-toastify';

export const RoutesPage: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [load, setLoad] = useState(false);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBuses = async () => {
    try {
      setLoad(true);
      const res = await busApi.getAll();
      if (res?.data?.data) {
        setBuses(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedBusId(res.data.data[0]._id);
        }
      }
    } catch (e: any) {
      toast.warn(e?.message || 'Failed to fetch routes info.');
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  // Filter routes by search query
  const filteredBuses = useMemo(() => {
    if (!searchQuery.trim()) return buses;
    const q = searchQuery.trim().toLowerCase();
    return buses.filter((bus) => {
      const nameMatch = bus.bus_name?.toLowerCase().includes(q);
      const stationMatch = bus.station_data?.some((s) => s.station?.toLowerCase().includes(q));
      return nameMatch || stationMatch;
    });
  }, [buses, searchQuery]);

  // If selected bus is filtered out, fall back to first matching
  useEffect(() => {
    if (filteredBuses.length > 0 && !filteredBuses.some((b) => b._id === selectedBusId)) {
      setSelectedBusId(filteredBuses[0]._id);
    }
  }, [filteredBuses, selectedBusId]);

  const activeBus = buses.find((b) => b._id === selectedBusId);
  const routeStations = activeBus?.station_data || [];
  const totalDistance = routeStations.reduce(
    (sum, item) => sum + (Number(item.Distance_from_Previous_Station) || 0),
    0
  );
  const startStation = routeStations[0]?.station || '—';
  const endStation = routeStations[routeStations.length - 1]?.station || '—';

  return (
    <div className="page-container max-w-7xl animate-fade-in space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[10px] font-bold uppercase tracking-wider text-blue-700 border border-blue-200 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Route Management
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Active Routes & Station Networks
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Visualize registered route networks, station sequences, transit distances, and schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Registered</span>
            <span className="text-xs font-black text-slate-800">{buses.length} Routes</span>
          </div>
        </div>
      </div>

      {load ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-16 animate-fade-in">
          <Loader text="Loading routes and stations..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Route Selector with Search (Scrollable) */}
          <div className="md:col-span-5 lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Route ({filteredBuses.length})
              </h2>
            </div>

            {/* Route Search Filter */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Filter route or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Scrollable Routes List */}
            <div className="max-h-[calc(100vh-230px)] overflow-y-auto space-y-2.5 pr-1 pb-2">
              {filteredBuses.length > 0 ? (
                filteredBuses.map((bus) => {
                  const stations = bus.station_data || [];
                  const start = stations[0]?.station || '—';
                  const end = stations[stations.length - 1]?.station || '—';
                  const isActive = selectedBusId === bus._id;
                  const busDistance = stations.reduce(
                    (sum, s) => sum + (Number(s.Distance_from_Previous_Station) || 0),
                    0
                  );

                  return (
                    <div
                      key={bus._id}
                      onClick={() => setSelectedBusId(bus._id)}
                      className={`p-3.5 cursor-pointer transition-all duration-150 border-2 rounded-2xl bg-white group ${
                        isActive
                          ? 'border-blue-600 bg-blue-50/30 shadow-sm ring-1 ring-blue-600/20'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/60 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-bold text-xs truncate ${
                              isActive ? 'text-blue-900 font-extrabold' : 'text-slate-900 group-hover:text-blue-600'
                            }`}
                          >
                            {bus.bus_name}
                          </p>

                          <div className="inline-flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-slate-600">
                            <span className="truncate max-w-[100px]">{start}</span>
                            <span className="text-blue-500 font-bold">&rarr;</span>
                            <span className="truncate max-w-[100px]">{end}</span>
                          </div>
                        </div>

                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[10px] text-slate-400 font-semibold">
                        <span>{stations.length} stop{stations.length !== 1 ? 's' : ''}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                          {busDistance} km
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                  No matching route found.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Visual Timeline Details (Sticky on Desktop) */}
          <div className="md:col-span-7 lg:col-span-8 md:sticky md:top-6 self-start">
            {activeBus ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-230px)] animate-fade-in">
                {/* Header Strip (Pinned at Top of Card) */}
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 flex-shrink-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                          {activeBus.bus_name}
                        </h3>
                        <StatusBadge status={activeBus.status} />
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-1">
                        <span className="text-blue-700 font-bold">{startStation}</span>
                        <span className="text-slate-400">&rarr;</span>
                        <span className="text-indigo-700 font-bold">{endStation}</span>
                        <span className="text-slate-300">·</span>
                        <span>{activeBus.Total_seat || 40} Seats</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                          Total Distance
                        </span>
                        <span className="text-sm font-bold text-blue-900">
                          {totalDistance} km
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scrollable Station Timeline Body */}
                <div className="p-5 overflow-y-auto flex-1 space-y-5">
                  {routeStations.length > 0 ? (
                    <div className="relative pl-6 border-l-2 border-slate-200 ml-4 space-y-6">
                      {routeStations.map((item, index) => {
                        const isFirst = index === 0;
                        const isLast = index === routeStations.length - 1;

                        return (
                          <div key={index} className="relative group">
                            {/* Timeline Point Indicator */}
                            <span
                              className={`absolute -left-[31px] top-1 w-5 h-5 rounded-full border-3 border-white shadow-xs flex items-center justify-center ${
                                isFirst
                                  ? 'bg-emerald-500'
                                  : isLast
                                  ? 'bg-rose-500'
                                  : 'bg-indigo-600'
                              }`}
                            />

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50/70 hover:bg-blue-50/40 rounded-xl border border-slate-200/70 transition-colors">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                                    {item.station}
                                  </h4>
                                  {isFirst && (
                                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                                      Origin
                                    </span>
                                  )}
                                  {isLast && (
                                    <span className="text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                                      Destination
                                    </span>
                                  )}
                                </div>

                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                  Scheduled Stop:{' '}
                                  <span className="font-semibold text-slate-800">
                                    {item.arrived_time}
                                  </span>
                                </p>
                              </div>

                              <div className="flex items-center gap-2 self-start sm:self-center">
                                {index > 0 ? (
                                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                                    +{item.Distance_from_Previous_Station} km
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                    0 km (Start)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs font-medium">
                      No station stop details registered for this route.
                    </div>
                  )}
                </div>

                {/* Card Footer (Pinned at Bottom of Card) */}
                <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium flex-shrink-0">
                  <span>
                    Sequence: <strong className="text-slate-800">{routeStations.length} Stations</strong>
                  </span>
                  <span>
                    Total Route Span: <strong className="text-slate-800">{totalDistance} km</strong>
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-16 text-center bg-white rounded-2xl border border-slate-200/90 shadow-sm text-slate-400 text-xs font-medium">
                Select a route from the left list to inspect its station network.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesPage;
