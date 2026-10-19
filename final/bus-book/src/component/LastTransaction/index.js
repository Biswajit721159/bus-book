import React, { useMemo } from "react";
import { useLastTransaction } from "./useLastTransaction";
import BookingListTable from "./BookingListTable";
import EmptyBookingState from "./EmptyBookingState";
import Pagination from "./Pagination";
import Loader from "../Loader";

const LastTransaction = () => {
	const {
		data,
		load,
		wishlistLoader,
		wishListId,
		totalPage,
		currentPage,
		addToWishList,
		changePage,
		showWishlistOnly,
		setShowWishlistOnly,
	} = useLastTransaction();

	const displayedData = useMemo(() => {
		if (!data || !Array.isArray(data)) return [];
		if (!showWishlistOnly) return data;
		return data.filter((item) => item.isWishlisted);
	}, [data, showWishlistOnly]);

	const totalCount = data?.length || 0;

	return (
		<div className="min-h-[calc(100vh-64px)] bg-slate-50/70 py-8 sm:py-10">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Top Header Card */}
				<div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="flex items-center gap-3.5">
						<div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
							<svg
								className="w-6 h-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
								/>
							</svg>
						</div>
						<div>
							<div className="flex items-center gap-2.5">
								<h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
									My Bookings
								</h1>
								{totalCount > 0 && (
									<span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
										{totalCount} {totalCount === 1 ? "Ticket" : "Tickets"}
									</span>
								)}
							</div>
							<p className="text-xs sm:text-sm text-slate-500 mt-0.5">
								Track your travel history, download e-tickets, and manage saved journeys
							</p>
						</div>
					</div>

					{/* Top Filter Actions & Page Badge */}
					{(showWishlistOnly || (data && data.length > 0)) && (
						<div className="flex flex-wrap items-center gap-3">
							{/* Wishlist Toggle Button */}
							<button
								type="button"
								onClick={() => {
									changePage(1);
									setShowWishlistOnly(!showWishlistOnly);
								}}
								className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
									showWishlistOnly
										? "bg-rose-50 text-rose-700 border-rose-200 shadow-sm ring-2 ring-rose-400/30"
										: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs"
								}`}
							>
								<svg
									className={`w-4 h-4 transition-colors ${
										showWishlistOnly ? "fill-rose-500 text-rose-500" : "fill-none text-slate-400"
									}`}
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
									/>
								</svg>
								<span>Saved Journeys</span>
							</button>

							{/* Page Badge */}
							<div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
								<span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
								<span>Page {currentPage} of {totalPage || 1}</span>
							</div>
						</div>
					)}
				</div>

				{/* Table, Empty or Loading States */}
				{load ? (
					<Loader text="Fetching your bookings..." />
				) : showWishlistOnly && (!displayedData || displayedData.length === 0) ? (
					/* Filtered Wishlist Empty State */
					<div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center my-6 shadow-sm">
						<div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center mb-3.5 shadow-xs">
							<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-black text-slate-900">No saved journeys found</h3>
						<p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
							You haven't marked any journeys to your wishlist yet, or no saved tickets match this page.
						</p>
						<button
							type="button"
							onClick={() => {
								changePage(1);
								setShowWishlistOnly(false);
							}}
							className="mt-5 px-5 py-2.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
						>
							Show All Bookings
						</button>
					</div>
				) : displayedData && displayedData.length > 0 ? (
					<>
						{/* Bookings List Table */}
						<BookingListTable
							data={displayedData}
							currentPage={currentPage}
							wishlistLoader={wishlistLoader}
							wishListId={wishListId}
							onAddToWishList={addToWishList}
						/>

						{/* Pagination Footer */}
						{totalPage > 1 && (
							<Pagination
								totalPage={totalPage}
								currentPage={currentPage}
								onChangePage={changePage}
							/>
						)}
					</>
				) : (
					/* Empty State Placeholder */
					<EmptyBookingState />
				)}
			</div>
		</div>
	);
};

export default LastTransaction;
