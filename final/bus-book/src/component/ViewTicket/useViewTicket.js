import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getBookingDetailsById, cancelTicket as cancelTicketApi } from "../../apis/booking";
import { addWishList, removeWishList } from "../../apis/wishlist";

export const useViewTicket = (ticketId) => {
	const [load, setLoad] = useState(false);
	const [data, setData] = useState();
	const [favouriteJourneyLoader, setFavouriteJourneyLoader] = useState(false);
	const [cancelModal, setCancelModal] = useState(false);
	const [cancelLoading, setCancelLoading] = useState(false);
	const [cancelTicketIds, setCancelTicketIds] = useState([]);

	const loadData = async () => {
		try {
			setLoad(true);
			const res = await getBookingDetailsById(ticketId);
			setData(res.data);
		} catch (error) {
			toast.error(error?.message || "Failed to fetch ticket details");
		} finally {
			setLoad(false);
		}
	};

	useEffect(() => {
		if (ticketId) {
			loadData();
		}
	}, [ticketId]);

	const addToFavouriteJourney = async () => {
		try {
			setFavouriteJourneyLoader(true);
			await addWishList(ticketId);
			setData((prev) => ({
				...prev,
				isWishlisted: true,
			}));
		} catch (error) {
			toast.error(error?.message || "Failed to add to wishlist");
		} finally {
			setFavouriteJourneyLoader(false);
		}
	};

	const removeFromFavouriteJourney = async () => {
		try {
			setFavouriteJourneyLoader(true);
			await removeWishList(ticketId);
			setData((prev) => ({
				...prev,
				isWishlisted: false,
			}));
		} catch (error) {
			toast.error(error?.message || "Failed to remove from wishlist");
		} finally {
			setFavouriteJourneyLoader(false);
		}
	};

	const cancelTicket = async () => {
		try {
			setCancelLoading(true);
			const response = await cancelTicketApi({ seatTicket: cancelTicketIds });
			setData(response.data);
			closeModal();
			setCancelTicketIds([]);
			toast.success("Ticket cancelled successfully");
		} catch (error) {
			toast.error(error?.message || "Something went wrong. Please try again.");
		} finally {
			setCancelLoading(false);
		}
	};

	const closeModal = () => {
		setCancelModal(false);
	};

	const openCancelModal = () => {
		if (cancelTicketIds.length > 0) {
			setCancelModal(true);
		}
	};

	const handleSelectTicket = (checked, seatId) => {
		setCancelTicketIds((prev) => (checked ? [...prev, seatId] : prev.filter((id) => id !== seatId)));
	};

	const copyId = async (id) => {
		try {
			await navigator.clipboard.writeText(id);
			toast.success("ID copied to clipboard!");
		} catch {
			toast.error("Failed to copy ID.");
		}
	};

	return {
		load,
		data,
		isFavouriteJourney: data?.isWishlisted,
		favouriteJourneyLoader,
		cancelModal,
		cancelLoading,
		cancelTicketIds,
		addToFavouriteJourney,
		removeFromFavouriteJourney,
		cancelTicket,
		closeModal,
		openCancelModal,
		handleSelectTicket,
		copyId,
	};
};
