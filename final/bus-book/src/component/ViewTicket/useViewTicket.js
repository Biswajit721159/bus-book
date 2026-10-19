import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getBookingDetailsById, cancelTicket as cancelTicketApi } from "../../apis/booking";
import { addWishList, removeWishList } from "../../apis/wishlist";
import { getIsReview } from "../../apis/review";

export const useViewTicket = (ticketId) => {
	const [load, setLoad] = useState(false);
	const [data, setData] = useState();
	const [favouriteJourneyLoader, setFavouriteJourneyLoader] = useState(false);
	const [cancelModal, setCancelModal] = useState(false);
	const [cancelLoading, setCancelLoading] = useState(false);
	const [cancelTicketIds, setCancelTicketIds] = useState([]);
	const [isReviewLoading, setIsReviewLoading] = useState(false);
	const [reviewData, setReviewData] = useState(null);

	const loadData = async () => {
		try {
			setLoad(true);
			const res = await getBookingDetailsById(ticketId);
			setData(res.data);
			if (res.data?.id) {
				getReview(res.data.id);
			}
		} catch (error) {
			toast.error(error?.message || "Failed to fetch ticket details");
		} finally {
			setLoad(false);
		}
	};

	const getReview = async (idToUse) => {
		const targetId = idToUse || data?.id || data?._id || ticketId;
		try {
			setIsReviewLoading(true);
			const res = await getIsReview(targetId);
			setReviewData(res.data);
		} catch (error) {
			// Fail silently if review status cannot be retrieved
		} finally {
			setIsReviewLoading(false);
		}
	};

	useEffect(() => {
		if (ticketId) {
			loadData();
		}
	}, [ticketId]);

	const addToFavouriteJourney = async () => {
		const targetId = data?.id || data?._id || ticketId;
		try {
			setFavouriteJourneyLoader(true);
			await addWishList(targetId);
			setData((prev) => ({
				...prev,
				isWishlisted: true,
			}));
			toast.success("Journey added to wishlist!");
		} catch (error) {
			toast.error(error?.message || "Failed to add to wishlist");
		} finally {
			setFavouriteJourneyLoader(false);
		}
	};

	const removeFromFavouriteJourney = async () => {
		const targetId = data?.id || data?._id || ticketId;
		try {
			setFavouriteJourneyLoader(true);
			await removeWishList(targetId);
			setData((prev) => ({
				...prev,
				isWishlisted: false,
			}));
			toast.success("Journey removed from wishlist");
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
		load: isReviewLoading || load,
		data,
		reviewData,
		setReviewData,
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
