import React from "react";
import { Link } from "react-router-dom";

const EmptyBookingState = () => {
	return (
		<div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-surface-200 rounded-2xl p-8 shadow-xs">
			<div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 border border-blue-100 shadow-xs">
				<svg
					className="w-8 h-8 text-blue-600"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.8}
						d="M8 7h8m-8 4h8m-8 4h5M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
					/>
				</svg>
			</div>
			<h3 className="text-xl font-bold text-surface-900 mb-2">No bookings found</h3>
			<p className="text-surface-500 text-sm mb-6 max-w-sm leading-relaxed">
				You haven't made any bus reservations yet. Explore bus routes and book your first journey today!
			</p>
			<Link
				to="/book-bus"
				className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95"
			>
				<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M8 7h8m-8 4h8m-8 4h5M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
					/>
				</svg>
				Book a Bus
			</Link>
		</div>
	);
};

export default EmptyBookingState;

