import React from "react";
import { Link, useLocation } from "react-router-dom";

export const NavLink = ({ to, children, onClick }) => {
	const location = useLocation();
	const isActive = location.pathname === to;

	return (
		<Link
			to={to}
			onClick={onClick}
			className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
				isActive
					? "bg-white/20 text-white"
					: "text-white/80 hover:text-white hover:bg-white/10"
			}`}
		>
			{children}
		</Link>
	);
};

export default NavLink;
