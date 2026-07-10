import React from "react";

const Pagination = ({ totalPage, currentPage, onChangePage }) => {
	if (totalPage <= 1) return null;

	return (
		<div className="flex items-center justify-center gap-2 mt-6">
			{/* Previous Page Button */}
			<button
				onClick={() => onChangePage(Math.max(1, currentPage - 1))}
				disabled={currentPage === 1}
				className="btn-secondary btn-sm px-3 py-2 rounded-lg border border-surface-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-50"
			>
				<svg
					className="w-4 h-4 text-surface-600"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>

			{/* Numbered Page Buttons */}
			{Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
				<button
					key={page}
					onClick={() => onChangePage(page)}
					className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-150 ${
						currentPage === page
							? "bg-primary-600 text-white shadow-sm"
							: "bg-white border border-surface-200 text-surface-600 hover:bg-surface-50"
					}`}
				>
					{page}
				</button>
			))}

			{/* Next Page Button */}
			<button
				onClick={() => onChangePage(Math.min(totalPage, currentPage + 1))}
				disabled={currentPage === totalPage}
				className="btn-secondary btn-sm px-3 py-2 rounded-lg border border-surface-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-50"
			>
				<svg
					className="w-4 h-4 text-surface-600"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</button>
		</div>
	);
};

export default Pagination;
