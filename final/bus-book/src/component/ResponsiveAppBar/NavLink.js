import React from "react";
import { Link, useLocation } from "react-router-dom";

export const NavLink = ({ to, children, onClick, icon: Icon, badge }) => {
	const location = useLocation();
	const isActive = location.pathname === to;

	return (
		<Link
			to={to}
			onClick={onClick}
			className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
				isActive
					? "bg-white/20 text-white shadow-xs ring-1 ring-white/30 backdrop-blur-sm"
					: "text-blue-100 hover:text-white hover:bg-white/10"
			}`}
		>
			{Icon && (
				<Icon
					className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${
						isActive ? "text-white" : "text-blue-200 group-hover:text-white"
					}`}
				/>
			)}
			<span>{children}</span>
			{badge !== undefined && badge !== null && (
				<span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold bg-white text-blue-700 rounded-full shadow-xs">
					{badge}
				</span>
			)}
			{isActive && (
				<span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white rounded-full shadow-xs" />
			)}
		</Link>
	);
};

export default NavLink;
