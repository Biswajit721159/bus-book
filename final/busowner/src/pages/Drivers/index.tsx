import React, { useEffect, useState } from 'react';
import { useDrivers } from '../../hooks/useDrivers';
import { Driver } from '../../types/driver';
import DeleteModal from '../../components/modals/DeleteModal';
import DriverModal from './components/DriverModal';
import { toast } from 'react-toastify';

export const Drivers: React.FC = () => {
  const { drivers, loading, fetchDrivers, addOrUpdateDriver, removeDriver } = useDrivers();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState<Partial<Driver>>({});
  const [deleteOpen, setDeleteOpen] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const openFormModal = (driver: Partial<Driver> = {}) => {
    setCurrentDriver(driver);
    setModalOpen(true);
  };

  const handleSave = async (driverToSave: Driver) => {
    try {
      await addOrUpdateDriver(driverToSave);
      toast.success(currentDriver.id ? 'Driver updated successfully' : 'Driver added successfully');
      setModalOpen(false);
    } catch {
      toast.warn('Failed to save driver');
    }
  };

  const handleDelete = async () => {
    if (deleteOpen.id) {
      try {
        await removeDriver(deleteOpen.id);
        toast.success('Driver removed successfully');
        setDeleteOpen({ open: false, id: null });
      } catch {
        toast.warn('Failed to delete driver');
      }
    }
  };

  const statusClsMap: Record<string, string> = {
    available: 'bg-emerald-100 text-emerald-700',
    on_trip: 'bg-blue-100 text-blue-700',
    leave: 'bg-red-100 text-red-700',
  };

  return (
    <div className="page-container max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Driver Management</h1>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">Maintain list of operators and availability status</p>
        </div>
        <button type="button" onClick={() => openFormModal({ status: 'available' })} className="btn-primary flex items-center gap-2 font-semibold">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Driver
        </button>
      </div>

      <div className="card overflow-hidden bg-white shadow-md rounded-2xl border border-slate-100">
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Driver Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">License Number</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Phone Number</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.length ? (
                drivers.map((drv) => (
                  <tr key={drv.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                          {drv.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">{drv.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-sm text-slate-650">{drv.licenseNumber}</td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">{drv.phone}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusClsMap[drv.status]}`}>
                        {drv.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openFormModal(drv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-indigo-750 bg-indigo-50 rounded-lg border border-indigo-150 hover:bg-indigo-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteOpen({ open: true, id: drv.id })}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 rounded-lg border border-red-150 hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                    {loading ? 'Loading drivers...' : 'No drivers registered yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <DriverModal
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          driver={currentDriver}
        />
      )}

      <DeleteModal
        open={deleteOpen.open}
        onClose={() => setDeleteOpen({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Driver"
        description="Are you sure you want to delete this driver? All schedules will be released."
      />
    </div>
  );
};

export default Drivers;
