import { Link, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Loader from "../Loader";
import { useViewTicket } from "./useViewTicket";
import JourneySummary from "./JourneySummary";
import PassengerTable from "./PassengerTable";
import CancelConfirmModal from "./CancelConfirmModal";

const ViewTicket = () => {
	const { _id } = useParams();
	const {
		load,
		data,
		isFavouriteJourney,
		favouriteJourneyLoader,
		cancelModal,
		cancelLoading,
		cancelTicketIds,
		addToFavouriteJourney,
		removeFromFavouriteJourney,
		cancelTicket,
		closeModal,
		openCancelModal,
		handleSelectTicket,
		copyId,
	} = useViewTicket(_id);

	if (load) return <Loader text="Loading ticket..." />;

	return (
		<div className="min-h-[calc(100vh-64px)] bg-surface-50">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold text-surface-900">Ticket Details</h1>
					</div>
					<div className="flex items-center gap-3">
						{/* Favourite button */}
						<button
							onClick={isFavouriteJourney ? removeFromFavouriteJourney : addToFavouriteJourney}
							disabled={favouriteJourneyLoader}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
								isFavouriteJourney
									? "bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
									: "bg-white border-surface-200 text-surface-600 hover:border-yellow-300 hover:text-yellow-600"
							}`}
							title={isFavouriteJourney ? "Remove from favourites" : "Add to favourites"}
						>
							{favouriteJourneyLoader ? (
								<ClipLoader size={14} color="currentColor" />
							) : (
								<svg
									className={`w-4 h-4 ${isFavouriteJourney ? "fill-yellow-500 text-yellow-500" : "fill-none text-current"}`}
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
									/>
								</svg>
							)}
							{isFavouriteJourney ? "Saved" : "Save Journey"}
						</button>
					</div>
				</div>

				{/* Journey Summary Card */}
				<JourneySummary data={data} onCopyId={copyId} />

				{/* Passengers Table */}
				<PassengerTable
					data={data}
					cancelTicketIds={cancelTicketIds}
					cancelLoading={cancelLoading}
					onCancelClick={openCancelModal}
					onSelectTicket={handleSelectTicket}
				/>

				{/* Back Action */}
				<div className="mt-6">
					<Link to="/my-bookings" className="btn-ghost text-sm inline-flex items-center gap-1">
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Back to My Bookings
					</Link>
				</div>
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
