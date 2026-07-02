import axios from "axios";
import { getErrorMessageFromError } from "../utilities/error-message";

const api = process.env.REACT_APP_API_JAVA;

const register = async (body) => {
	try {
		const response = await axios.post(`${api}/api/auth/register`, body);
		return response;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const registerverify = async (body) => {
	try {
		const response = await axios.post(`${api}/api/auth/register/verify-otp`, body);
		return response;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const login = async (body) => {
	try {
		const response = await axios.post(`${api}/api/auth/login`, body);
		return response;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const loginverify = async (body) => {
	try {
		const response = await axios.post(`${api}/api/auth/login/verify-otp`, body);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const resentOtp = async (body) => {
	try {
		const response = await axios.post(`${api}/api/auth/resent-otp`, body);
		return response;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const forgotPassword = async (body) => {
	try {
		const response = await axios.post(`${api}/api/auth/forgot-password`, body);
		return response;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const resetPassword = async (body) => {
	try {
		const response = await axios.post(`${api}/api/auth/reset-password`, body);
		return response;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

const googleLogin = async (body) => {
	try {
		const response = await axios.post(`${api}/api/auth/google-login`, body);
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessageFromError(error));
	}
};

export { register, registerverify, login, loginverify, resentOtp, forgotPassword, resetPassword, googleLogin };
