import axiosInstance from "./axiosInstance";
import { getErrorMessageFromError } from "../utilities/error-message";

const addWishList = async (bookingId) => {
	try {
		const response = await axiosInstance.post(`/api/wishlist/${bookingId}`);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const removeWishList = async (bookingId) => {
	try {
		const response = await axiosInstance.delete(`/api/wishlist/${bookingId}`);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

export { addWishList, removeWishList };
