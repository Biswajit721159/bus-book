import axiosInstance from "./axiosInstance";
import { getErrorMessageFromError } from "../utilities/error-message";

const addReview = async (body) => {
	try {
		const response = await axiosInstance.post(`/api/review`, body);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const getIsReview = async (id) => {
	try {
		const response = await axiosInstance.get(`/api/review/status/${id}`);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const getReviewsByBus = async (busId, page = 1, size = 5) => {
	try {
		const response = await axiosInstance.get(`/api/review/bus/${busId}?page=${page}&size=${size}`);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

export { addReview, getIsReview, getReviewsByBus };
