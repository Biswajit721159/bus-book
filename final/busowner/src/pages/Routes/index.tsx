import React, { useEffect, useState } from 'react';
import { busApi } from '../../services/apiService';
import { Bus } from '../../types/bus';
import FullPageLoader from '../../components/common/FullPageLoader';
import { toast } from 'react-toastify';

export const RoutesPage: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [load, setLoad] = useState(false);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

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

  const activeBus = buses.find((b) => b._id === selectedBusId);
  const routeStations = activeBus?.station_data || [];
  const totalDistance = routeStations.reduce((sum, item) => sum + (item.Distance_from_Previous_Station || 0), 0);

  return (
    <div className="page-container max-w-6xl">
      <div className="mb-6">
        <h1 className="page-title">Active Routes & Station Networks</h1>
        <p className="text-sm text-slate-500 mt-0.5 font-medium">Visualize your registered route networks and stops</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left List: Route Selector */}
        <div className="md:col-span-1 space-y-3">
          <h2 className="section-title text-base font-semibold">Select Route</h2>
          <div className="space-y-2">
            {buses.length > 0 ? (
              buses.map((bus) => {
                const stations = bus.station_data || [];
                const start = stations[0]?.station || '—';
                const end = stations[stations.length - 1]?.station || '—';
                const isActive = selectedBusId === bus._id;

                return (
                  <div
                    key={bus._id}
                    onClick={() => setSelectedBusId(bus._id)}
                    className={`card p-4 cursor-pointer transition-all duration-200 border-2 rounded-2xl hover:border-indigo-400 bg-white ${
                      isActive ? 'border-indigo-600 bg-indigo-50/20 shadow-sm' : 'border-slate-200'
                    }`}
                  >
                    <p className="font-semibold text-slate-805">{bus.bus_name}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      {start} &rarr; {end}
                    </p>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                      {stations.length} stops · {stations.reduce((sum, s) => sum + (s.Distance_from_Previous_Station || 0), 0)} km
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-400 font-medium">No route listings found.</p>
            )}
          </div>
        </div>

        {/* Right Pane: Visual Timeline Details */}
        <div className="md:col-span-2">
          {activeBus ? (
            <div className="card p-6 space-y-6 bg-white shadow-md rounded-2xl border border-slate-100 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{activeBus.bus_name} Route</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Bus status: <span className="font-bold text-slate-700 capitalize">{activeBus.status}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-indigo-600">{totalDistance} km</p>
                  <p className="text-xs text-slate-400 font-semibold">Total Distance</p>
                </div>
              </div>

              {/* Station List */}
              <div className="space-y-4 relative pl-6 border-l border-slate-200 ml-3">
                {routeStations.map((item, index) => {
                  const isFirst = index === 0;
                  const isLast = index === routeStations.length - 1;

                  return (
                    <div key={index} className="relative">
                      {/* Timeline point */}
                      <span
                        className={`absolute -left-9 top-1.5 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
                          isFirst ? 'bg-emerald-500' : isLast ? 'bg-red-500' : 'bg-indigo-500'
                        }`}
                      />

                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-slate-850 text-sm">{item.station}</h4>
                          <p className="text-xs text-slate-500 mt-0.5 font-medium">
                            Scheduled Stop: <span className="font-semibold text-slate-700">{item.arrived_time}</span>
                          </p>
                        </div>
                        {index > 0 && (
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            +{item.Distance_from_Previous_Station} km
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center text-slate-400 bg-white shadow-md rounded-2xl border border-slate-100 font-medium">
              <p>Select a route from the list to view its station layout.</p>
            </div>
          )}
        </div>
      </div>

      <FullPageLoader open={load} />
    </div>
  );
};

export default RoutesPage;
