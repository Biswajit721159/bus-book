import axiosInstance from "./axiosInstance";
import { getErrorMessageFromError } from "../utilities/error-message";

const getBusById = async (id) => {
	try {
		const response = await axiosInstance.get(`/api/buses/${id}`);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

export { getBusById };
