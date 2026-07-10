import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GuestRoute = ({ children }) => {
	const user = useSelector((state) => state.user.user);

	if (user) {
		return <Navigate to="/book-bus" replace />;
	}
	return children;
};

export default GuestRoute;
