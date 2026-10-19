import React from "react";

const Pagination = ({ totalPage, currentPage, onChangePage }) => {
	if (totalPage <= 1) return null;

	return (
		<div className="flex items-center justify-center gap-2 mt-8 animate-fade-in">
			{/* Previous Page Button */}
			<button
				onClick={() => onChangePage(Math.max(1, currentPage - 1))}
				disabled={currentPage === 1}
				className="h-10 px-3.5 rounded-2xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center gap-1.5 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:text-blue-600 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
				title="Previous page"
			>
				<svg
					className="w-4 h-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2.5}
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				<span className="hidden sm:inline">Previous</span>
			</button>

			{/* Numbered Page Buttons */}
			<div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
				{Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
					<button
						key={page}
						onClick={() => onChangePage(page)}
						className={`w-9 h-8 rounded-xl text-xs font-black transition-all duration-150 cursor-pointer ${
							currentPage === page
								? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25 scale-105"
								: "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
						}`}
					>
						{page}
					</button>
				))}
			</div>

			{/* Next Page Button */}
			<button
				onClick={() => onChangePage(Math.min(totalPage, currentPage + 1))}
				disabled={currentPage === totalPage}
				className="h-10 px-3.5 rounded-2xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center gap-1.5 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:text-blue-600 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
				title="Next page"
			>
				<span className="hidden sm:inline">Next</span>
				<svg
					className="w-4 h-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2.5}
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</button>
		</div>
	);
};

export default Pagination;
