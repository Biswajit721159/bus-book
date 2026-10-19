import React from "react";

const ShowPreviousHistory = ({
	searchHistory = [],
	deletePreviousHistory = () => {},
	onClickSearchHistory = () => {},
	className = "mt-4",
}) => {
	if (!searchHistory || searchHistory.length === 0) return null;

	return (
		<div className={className}>
			<div className="flex items-center justify-between mb-2.5">
				<p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider select-none flex items-center gap-1.5">
					<svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					Recent Searches
				</p>
				<span className="text-[10px] text-slate-400 font-medium">Click to re-check</span>
			</div>
			<div className="flex flex-wrap gap-2">
				{searchHistory.map((item) => (
					<div
						key={item}
						className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-colors duration-150 group"
					>
						<button
							type="button"
							onClick={() => onClickSearchHistory(item)}
							className="flex items-center gap-1.5 focus:outline-none py-0.5"
							title={`Search for "${item}"`}
						>
							<span className="font-mono text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
								{item}
							</span>
						</button>

						<span className="h-3 w-px bg-slate-200" />

						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								deletePreviousHistory(item);
							}}
							className="w-4 h-4 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
							aria-label={`Remove search history item "${item}"`}
							title="Remove"
						>
							<svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default ShowPreviousHistory;
