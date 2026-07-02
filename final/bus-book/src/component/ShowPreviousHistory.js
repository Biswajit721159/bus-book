import React from "react";

const ShowPreviousHistory = ({
	searchHistory = [],
	deletePreviousHistory = () => {},
	onClickSearchHistory = () => {},
}) => {
	if (!searchHistory || searchHistory.length === 0) return null;

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
			<p className="text-xs text-surface-500 font-semibold mb-2.5 uppercase tracking-wider select-none">
				Recent Searches
			</p>
			<div className="flex flex-wrap gap-2">
				{searchHistory.map((item) => (
					<div
						key={item}
						className="flex items-center gap-1.5 pl-3 pr-1 py-1 bg-white border border-surface-200 rounded-lg shadow-sm hover:border-primary-300 hover:bg-primary-50/50 hover:shadow transition-all duration-200 group"
					>
						{/* Search trigger button */}
						<button
							onClick={() => onClickSearchHistory(item)}
							className="flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md py-0.5"
							title={`Search for "${item}"`}
						>
							<svg
								className="w-3.5 h-3.5 text-surface-400 group-hover:text-primary-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 flex-shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span className="font-mono text-xs text-surface-700 group-hover:text-primary-700 transition-colors select-all">
								{item}
							</span>
						</button>

						{/* Divider line */}
						<span className="h-3.5 w-[1px] bg-surface-200" />

						{/* Delete item button */}
						<button
							onClick={() => deletePreviousHistory(item)}
							className="w-5 h-5 rounded-md flex items-center justify-center text-surface-400 hover:text-red-500 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-all duration-200"
							aria-label={`Remove search history item "${item}"`}
							title="Remove from history"
						>
							<svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default ShowPreviousHistory;

