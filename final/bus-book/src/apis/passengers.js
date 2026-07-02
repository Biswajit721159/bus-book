import axiosInstance from "./axiosInstance";
import { getErrorMessageFromError } from "../utilities/error-message";

const getAllUsers = async () => {
	try {
		const response = await axiosInstance.get(`/api/master-list`);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const addUser = async (body) => {
	try {
		const response = await axiosInstance.post(`/api/master-list`, body);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const updateUser = async (id,body) => {
	try {
		const response = await axiosInstance.put(`/api/master-list/${id}`, body);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const deleteUser = async (id) => {
	try {
		const response = await axiosInstance.delete(`/api/master-list/${id}`);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

export { getAllUsers, addUser, updateUser, deleteUser };
