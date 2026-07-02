import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getBookingDetails } from "../../apis/booking";
import { addWishList, removeWishList } from "../../apis/wishlist";

export const useLastTransaction = () => {
	const [data, setData] = useState([]);
	const [load, setLoad] = useState(true);
	const [wishlistLoader, setWishlistLoader] = useState(false);
	const [wishListId, setWishListId] = useState();
	const [totalPage, setTotalPage] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);

	const loadTicket = async (page = 1) => {
		try {
			setLoad(true);
			const res = await getBookingDetails(page);

			const bookings =
				res?.data?.bookingData || res?.data?.content || (Array.isArray(res?.data) ? res.data : []);
			setData(bookings);

			const pages = res?.data?.totalPage || res?.data?.totalPages || 1;
			setTotalPage(pages);
		} catch (error) {
			toast.warn(error?.message || "Failed to load bookings");
		} finally {
			setLoad(false);
		}
	};

	useEffect(() => {
		loadTicket();
	}, []);

	const addToWishList = async (id, isWishlisted) => {
		if (wishlistLoader) return;
		setWishlistLoader(true);
		setWishListId(id);

		try {
			if (isWishlisted) {
				await removeWishList(id);
			} else {
				await addWishList(id);
			}

			setData((prev) =>
				prev.map((item) => {
					const itemId = item.id || item._id;
					return itemId === id
						? { ...item, isWishlisted: !isWishlisted, is_wishlist: !isWishlisted }
						: item;
				}),
			);
			toast.success(
				isWishlisted ? "Journey removed from saved journeys" : "Journey saved successfully",
			);
		} catch (error) {
			toast.error(error?.message || "Failed to update saved journey status");
		} finally {
			setWishlistLoader(false);
		}
	};

	const changePage = (page) => {
		setCurrentPage(page);
		loadTicket(page);
	};

	return {
		data,
		load,
		wishlistLoader,
		wishListId,
		totalPage,
		currentPage,
		addToWishList,
		changePage,
	};
};
