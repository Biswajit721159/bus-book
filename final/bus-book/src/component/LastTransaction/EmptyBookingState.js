import React from "react";
import { Link } from "react-router-dom";

const EmptyBookingState = () => {
	return (
		<div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-surface-200 rounded-2xl p-8 shadow-sm">
			<div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-5 animate-bounce">
				<svg
					className="w-8 h-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
					/>
				</svg>
			</div>
			<h3 className="text-xl font-bold text-surface-900 mb-2">No bookings yet</h3>
			<p className="text-surface-500 text-sm mb-6 max-w-sm leading-relaxed">
				You haven't made any bookings yet. Start by exploring our bus operator routes and book your first journey today!
			</p>
			<Link to="/book-bus" className="btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-primary-700">
				Book a Bus
			</Link>
		</div>
	);
};

export default EmptyBookingState;
