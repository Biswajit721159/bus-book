import axiosInstance from "./axiosInstance";
import { getErrorMessageFromError } from "../utilities/error-message";

const getBookingDetails = async () => {
	try {
		const response = await axiosInstance.get(`/api/booking`);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const getBookingDetailsById = async (id) => {
	try {
		const response = await axiosInstance.get(`/api/booking/${id}`);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const cancelTicket = async (body) => {
	try {
		const response = await axiosInstance.post(`/api/booking/cancel`, body);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const getGuestBookingDetails = async (bookingId) => {
	try {
		const response = await axiosInstance.get(`/api/booking/guest/${bookingId}`);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

export { getBookingDetails, getBookingDetailsById, cancelTicket, getGuestBookingDetails };
