import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loadStation, loadBus, fetchBusData } from "../../redux/BusSlice";
import { getCount } from "../../apis/seat";

export const useHome = () => {
	const dispatch = useDispatch();
	const date = useSelector((state) => state.BusSearch.date);
	const src = useSelector((state) => state.BusSearch.src);
	const dist = useSelector((state) => state.BusSearch.dist);
	const { Bus, station, loadingBus, loadingStation } = useSelector((state) => state.Bus);

	const [busState, setBusState] = useState({
		bus__id: "",
		disabled_showseat: false,
		Available_seat: 0,
		seat_res_come: false,
	});

	useEffect(() => {
		if (Bus?.length === 0 && src?.length !== 0 && dist?.length !== 0) {
			dispatch(fetchBusData({ source: src, dist }));
		} else if (Bus?.length === 0) {
			dispatch(loadBus());
		}
		if (station?.length === 0) dispatch(loadStation());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch]);

	const showSeat = async (busId, srcStation, distStation) => {
		if (date.length < 10) {
			toast.warn("Please select a travel date first!");
			return;
		}
		if (srcStation === distStation) {
			toast.warn("Source and Destination cannot be the same");
			return;
		}
		setBusState((prev) => ({
			...prev,
			bus__id: busId,
			seat_res_come: false,
			disabled_showseat: true,
		}));

		try {
			const res = await getCount({
				source: srcStation,
				dist: distStation,
				bookingDate: date,
				busId,
			});
			setBusState((prev) => ({
				...prev,
				Available_seat: res.data.count,
				disabled_showseat: false,
				seat_res_come: true,
			}));
		} catch (error) {
			toast.error(error?.message || "Something went wrong");
			setBusState((prev) => ({ ...prev, disabled_showseat: false }));
		}
	};

	return {
		date,
		src,
		dist,
		Bus,
		loadingBus,
		loadingStation,
		busState,
		showSeat,
	};
};
