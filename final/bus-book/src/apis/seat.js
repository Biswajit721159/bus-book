import axiosInstance from "./axiosInstance";
import { getErrorMessageFromError } from "../utilities/error-message";

const getCount = async (body) => {
	try {
		const response = await axiosInstance.post(`/api/seat/count`, body);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const getSeatRecord = async (body) => {
	try {
		const response = await axiosInstance.post(`/api/seat/seat-list`, body);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const lockSeatRecord = async (body) => {
	try {
		const response = await axiosInstance.post(`/api/seatLock`, body);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

export { getCount, getSeatRecord, lockSeatRecord };
