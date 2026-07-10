import React from "react";

const EmptyHomeState = () => {
	return (
		<div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-surface-200 rounded-2xl p-8 shadow-sm">
			<div className="relative mb-6">
				<div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center animate-pulse">
					<svg
						className="w-10 h-10 text-primary-400"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z" />
					</svg>
				</div>
				<div className="absolute -bottom-1 -right-1 w-7 h-7 bg-surface-100 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
					<svg
						className="w-4 h-4 text-surface-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
			</div>
			<h3 className="text-xl font-bold text-surface-900 mb-2">Search for a route above</h3>
			<p className="text-surface-500 text-sm max-w-sm leading-relaxed">
				Select your source, destination, and travel date to find available buses on your route.
			</p>
		</div>
	);
};

export default EmptyHomeState;
