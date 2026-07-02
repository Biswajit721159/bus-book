import React from "react";

const EmptyMasterListState = ({ onAddClick }) => {
	return (
		<div className="card flex flex-col items-center justify-center py-16 text-center bg-white border border-surface-200 rounded-2xl p-8 shadow-sm">
			<div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-5 animate-bounce">
				<svg
					className="w-7 h-7"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
			</div>
			<h3 className="text-xl font-bold text-surface-900 mb-2">No passengers yet</h3>
			<p className="text-sm text-surface-500 mb-6 max-w-xs leading-relaxed">
				Save passenger names now to quickly assign seats and speed up your ticket booking process later!
			</p>
			<button onClick={onAddClick} className="btn-primary px-5 py-2.5 rounded-lg font-semibold shadow-sm hover:bg-primary-700">
				Add First Passenger
			</button>
		</div>
	);
};

export default EmptyMasterListState;
