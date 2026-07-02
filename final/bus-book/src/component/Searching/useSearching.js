import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loadBus, fetchBusData } from "../../redux/BusSlice";
import { BusSearchmethod } from "../../redux/BusSearchSlice";

export const useSearching = () => {
	const dispatch = useDispatch();
	const src = useSelector((s) => s.BusSearch.src);
	const dist = useSelector((s) => s.BusSearch.dist);
	const date = useSelector((s) => s.BusSearch.date);
	const { station } = useSelector((s) => s.Bus);

	const [disabled, setDisabled] = useState(false);
	const [errors, setErrors] = useState({ src: "", dist: "", date: "" });

	const validate = () => {
		const e = { src: "", dist: "", date: "" };
		let ok = true;
		if (!src) {
			e.src = "Select a source";
			ok = false;
		}
		if (!dist) {
			e.dist = "Select a destination";
			ok = false;
		}
		if (!date) {
			e.date = "Pick a date";
			ok = false;
		}
		setErrors(e);
		return ok;
	};

	const findBus = () => {
		if (src && dist && src === dist) {
			toast.warn("Source and Destination cannot be the same");
			return;
		}
		if (!validate()) return;
		setDisabled(true);
		dispatch(fetchBusData({ source: src, dist }));
		setDisabled(false);
	};

	const clearSearch = () => {
		dispatch(BusSearchmethod.clearsearch());
		dispatch(loadBus());
		setErrors({ src: "", dist: "", date: "" });
	};

	const swap = () => {
		dispatch(BusSearchmethod.Addsrc(dist));
		dispatch(BusSearchmethod.adddist(src));
	};

	const handleSrcChange = (val) => {
		dispatch(BusSearchmethod.Addsrc(val));
		setErrors((p) => ({ ...p, src: "" }));
	};

	const handleDistChange = (val) => {
		dispatch(BusSearchmethod.adddist(val));
		setErrors((p) => ({ ...p, dist: "" }));
	};

	const handleDateChange = (val) => {
		dispatch(BusSearchmethod.addate(val));
		setErrors((p) => ({ ...p, date: "" }));
	};

	return {
		src,
		dist,
		date,
		station,
		disabled,
		errors,
		findBus,
		clearSearch,
		swap,
		handleSrcChange,
		handleDistChange,
		handleDateChange,
	};
};
export default useSearching;
