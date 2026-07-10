const getErrorMessageFromError = (error) => {
	const msg = error?.response?.data?.message || error?.message;
	return msg;
};

const getSuccessMessageFromResponse = (response) => {
	const msg = response?.data?.message || response?.message;
	return msg;
};

const getWarningMessageFromResponse = (response) => {
	const msg = response?.data?.message || response?.message;
	return msg;
};

export { getErrorMessageFromError, getSuccessMessageFromResponse, getWarningMessageFromResponse };
