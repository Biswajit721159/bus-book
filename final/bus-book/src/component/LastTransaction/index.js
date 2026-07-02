import React from "react";
import Loader from "../Loader";
import { useLastTransaction } from "./useLastTransaction";
import BookingListTable from "./BookingListTable";
import EmptyBookingState from "./EmptyBookingState";
import Pagination from "./Pagination";

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
	} = useLastTransaction();

	return (
		<div className="min-h-[calc(100vh-64px)] bg-surface-50">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header Section */}
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-surface-900">My Bookings</h1>
					<p className="text-sm text-surface-500 mt-1">View and manage all your bus bookings</p>
				</div>

				{load ? (
					<div className="flex items-center justify-center py-24">
						<div className="flex flex-col items-center gap-3">
							<div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
							<p className="text-sm text-surface-500">Loading bookings...</p>
						</div>
					</div>
				) : data && data.length > 0 ? (
					<>
						{/* Bookings List Table */}
						<BookingListTable
							data={data}
							currentPage={currentPage}
							wishlistLoader={wishlistLoader}
							wishListId={wishListId}
							onAddToWishList={addToWishList}
						/>

						{/* Pagination Footer */}
						<Pagination
							totalPage={totalPage}
							currentPage={currentPage}
							onChangePage={changePage}
						/>
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
