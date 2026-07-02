import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setIsPending,
  setIsApproved,
  setIsRejected,
  setTotalPages,
  setCurrentPage,
  useGetBussQuery,
} from '../store/slices/busSlice';
import { busApi } from '../services/apiService';
import { StationData, Bus } from '../types/bus';

export const useBuses = () => {
  const dispatch = useDispatch();
  const busState = useSelector((state: RootState) => state.busDetails);

  const setPending = () => dispatch(setIsPending());
  const setApproved = () => dispatch(setIsApproved());
  const setRejected = () => dispatch(setIsRejected());
  const setPage = (page: number) => dispatch(setCurrentPage(page));
  const setPages = (pages: number) => dispatch(setTotalPages(pages));

  const createBus = async (name: string, seats: number, stations: StationData[]) =>
    busApi.create(name, seats, stations);

  const updateBus = async (busData: Partial<Bus>) =>
    busApi.update(busData);

  const fetchBusesByEmail = async () =>
    busApi.getAll();

  const fetchBusById = async (id: string) =>
    busApi.getById(id);

  return {
    ...busState,
    setPending,
    setApproved,
    setRejected,
    setPage,
    setPages,
    createBus,
    updateBus,
    fetchBusesByEmail,
    fetchBusById,
    useGetBussQuery,
  };
};
