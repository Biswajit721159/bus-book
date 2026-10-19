import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import Loader, { Spinner } from "../Loader";
import { useViewTicket } from "./useViewTicket";
import JourneySummary from "./JourneySummary";
import PassengerTable from "./PassengerTable";
import CancelConfirmModal from "./CancelConfirmModal";
import ReviewJourney from "./ReviewJourney";

const ViewTicket = () => {
	const { _id } = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	const fromPage = location.state?.fromPage;
	const backUrl = fromPage ? `/my-bookings?page=${fromPage}` : "/my-bookings";

	const {
		load,
		data,
		reviewData,
		setReviewData,
		isFavouriteJourney,
		favouriteJourneyLoader,
		addToFavouriteJourney,
		removeFromFavouriteJourney,
		cancelModal,
		cancelLoading,
		cancelTicketIds,
		cancelTicket,
		closeModal,
		openCancelModal,
		handleSelectTicket,
		copyId,
	} = useViewTicket(_id);

	const handleBack = (e) => {
		e.preventDefault();
		if (fromPage) {
			navigate(`/my-bookings?page=${fromPage}`);
		} else if (window.history.length > 2) {
			navigate(-1);
		} else {
			navigate("/my-bookings");
		}
	};

	if (load) return <Loader text="Loading ticket..." />;

	return (
		<div className="min-h-[calc(100vh-64px)] bg-slate-50/70 py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Top Navigation Row */}
				<div className="flex items-center justify-between mb-5 flex-wrap gap-3">
					<button
						type="button"
						onClick={handleBack}
						className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-surface-600 hover:text-blue-700 hover:bg-blue-50 border border-surface-200 bg-white transition-all shadow-xs hover:shadow-sm group cursor-pointer"
					>
						<svg
							className="w-4 h-4 text-surface-400 group-hover:text-blue-600 transition-colors"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
						</svg>
						Back to My Bookings
					</button>

					<div className="flex items-center gap-2.5">
						{/* Wishlist / Save Journey Toggle Button */}
						<button
							type="button"
							onClick={isFavouriteJourney ? removeFromFavouriteJourney : addToFavouriteJourney}
							disabled={favouriteJourneyLoader}
							className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 cursor-pointer ${
								isFavouriteJourney
									? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
									: "bg-white text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
							}`}
							aria-label={isFavouriteJourney ? "Remove from Wishlist" : "Save to Wishlist"}
						>
							{favouriteJourneyLoader ? (
								<Spinner size="xs" color="rose" />
							) : (
								<svg
									className={`w-3.5 h-3.5 transition-colors ${
										isFavouriteJourney ? "fill-rose-500 text-rose-500" : "fill-none text-current"
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
							)}
							<span>{isFavouriteJourney ? "Saved in Wishlist" : "Add to Wishlist"}</span>
						</button>

						<ReviewJourney reviewData={reviewData} bookingId={data?.id || data?._id || _id} setReviewData={setReviewData} />
					</div>
				</div>

				{/* Title Banner */}
				<div className="mb-6 flex items-center justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 tracking-tight">Ticket Details</h1>
						<p className="text-xs sm:text-sm text-surface-500 mt-1">
							Review reservation confirmation, seat allocations, and route schedule
						</p>
					</div>
				</div>

				{/* Journey Summary Card */}
				<JourneySummary data={data} />

				{/* Passengers Table */}
				<PassengerTable
					data={data}
					cancelTicketIds={cancelTicketIds}
					cancelLoading={cancelLoading}
					onCancelClick={openCancelModal}
					onSelectTicket={handleSelectTicket}
				/>
			</div>

			{/* Cancel Confirmation Modal */}
			<CancelConfirmModal
				isOpen={cancelModal}
				isLoading={cancelLoading}
				onClose={closeModal}
				onConfirm={cancelTicket}
			/>
		</div>
	);
};

export default ViewTicket;
