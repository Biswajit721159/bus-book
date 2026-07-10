import axiosInstance from "./axiosInstance";
import { getErrorMessageFromError } from "../utilities/error-message";

const makePayment = async (body) => {
    try {
        const response = await axiosInstance.post(`/api/payment/create`, body);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessageFromError(error));
    }
};

export { makePayment };