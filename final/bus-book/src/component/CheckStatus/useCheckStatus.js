import { useState } from "react";
import { toast } from "react-toastify";
import { getGuestBookingDetails } from "../../apis/booking";

const api = process.env.REACT_APP_API;

export const useCheckStatus = () => {
	const [idNumber, setIdNumber] = useState("");
	const [data, setData] = useState();
	const [loading, setLoading] = useState(false);
	const [searchHistory, setSearchHistory] = useState(
		JSON.parse(localStorage.getItem("searchHistory")) || [],
	);

	const addToHistory = (id) => {
		const newHistory = [id, ...searchHistory.filter((el) => el !== id)].slice(0, 10);
		setSearchHistory(newHistory);
		localStorage.setItem("searchHistory", JSON.stringify(newHistory));
	};

	const deletePreviousHistory = (id) => {
		const newHistory = searchHistory.filter((el) => el !== id);
		setSearchHistory(newHistory);
		localStorage.setItem("searchHistory", JSON.stringify(newHistory));
	};

	const onClickSearchHistory = (id) => {
		setIdNumber(id);
	};

	const submit = async () => {
		if (!idNumber.trim()) {
			toast.warn("Please enter a valid booking ID");
			return;
		}
		setLoading(true);
		try {
			const res = await getGuestBookingDetails(idNumber);
			setData(res.data);
			toast.success("Ticket found!");
			addToHistory(idNumber);
		} catch (error) {
			toast.error(error?.message || "Failed to fetch ticket details");
		} finally {
			setLoading(false);
		}
	};

	return {
		idNumber,
		setIdNumber,
		data,
		loading,
		searchHistory,
		submit,
		deletePreviousHistory,
		onClickSearchHistory,
	};
};
