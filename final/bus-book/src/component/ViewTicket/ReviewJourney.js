import { useState } from "react";
import { addReview } from "../../apis/review";
import { toast } from "react-toastify";

const ReviewJourney = ({ reviewData, bookingId, setReviewData }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [rating, setRating] = useState(0);
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
		const [hoverRating, setHoverRating] = useState(0);

	const handleSubmit = async () => {
		if (rating < 1 || rating > 5) {
			toast.error("Please provide a valid rating (1-5)");
			return;
		}
		if (message.length < 5 || message.length > 300) {
			toast.error("Review message must be between 5 and 300 characters");
			return;
		}

		try {
			setIsLoading(true);
			await addReview({ rating, bookingId, message });
			toast.success("Review submitted successfully");
			setReviewData({ ...reviewData, status: true });
			setIsOpen(false);
		} catch (error) {
			toast.error(error?.message || "Failed to submit review");
		} finally {
			setIsLoading(false);
		}
	};

	if (reviewData?.status) {
		return null;
	}

	return (
		<>
			<button
				className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-all duration-150 shadow-sm hover:shadow-md"
				onClick={() => setIsOpen(true)}
			>
				Add Review
			</button>

			{isOpen && (
				<div
					className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300"
					onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
				>
					<div className="p-0 overflow-hidden shadow-2xl rounded-2xl bg-white border border-surface-100 w-[90%] max-w-md transform transition-all duration-300 scale-100">
						{/* Modal Header */}
						<div className="px-6 py-5 border-b border-surface-50 bg-gradient-to-b from-surface-50/50 to-white">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
									<svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								</div>
								<div>
									<h3 className="font-bold text-surface-900 text-lg">Rate your journey</h3>
									<p className="text-xs text-surface-500">Your feedback helps us improve.</p>
								</div>
							</div>
						</div>

						{/* Modal Body */}
						<div className="px-6 py-6 flex flex-col gap-6">
							<div>
								<div className="flex justify-center gap-3">
									{[1, 2, 3, 4, 5].map((star) => (
										<svg
											key={star}
											onClick={() => setRating(star)}
											onMouseEnter={() => setHoverRating(star)}
											onMouseLeave={() => setHoverRating(0)}
											className={`w-10 h-10 cursor-pointer transition-all duration-200 hover:scale-110 ${
												star <= (hoverRating || rating)
													? "text-yellow-400 drop-shadow-sm"
													: "text-gray-200"
											}`}
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									))}
								</div>
								<div className="text-center mt-2 h-4">
									<span className="text-sm font-medium text-surface-500">
										{hoverRating === 1 || rating === 1 ? "Poor" :
										 hoverRating === 2 || rating === 2 ? "Fair" :
										 hoverRating === 3 || rating === 3 ? "Good" :
										 hoverRating === 4 || rating === 4 ? "Very Good" :
										 hoverRating === 5 || rating === 5 ? "Excellent" : ""}
									</span>
								</div>
							</div>

							<div>
								<label className="block text-sm font-semibold text-surface-700 mb-2">
									Tell us more
								</label>
								<textarea
									className="w-full border border-surface-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all outline-none resize-none shadow-sm bg-surface-50/30"
									rows="4"
									placeholder="What did you like or dislike? (5 to 300 characters)"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
								></textarea>
							</div>
						</div>

						{/* Modal Footer */}
						<div className="flex gap-3 px-6 py-5 border-t border-surface-100 bg-surface-50/80">
							<button
								onClick={() => setIsOpen(false)}
								disabled={isLoading}
								className="flex-1 py-2.5 rounded-xl border-surface-200 border bg-white text-surface-700 font-semibold hover:bg-surface-50 hover:text-surface-900 transition-all active:scale-95"
							>
								Cancel
							</button>
							<button
								onClick={handleSubmit}
								disabled={isLoading || rating === 0 || message.length < 5}
								className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold shadow-md shadow-yellow-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
							>
								{isLoading ? (
									<>
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										Submitting...
									</>
								) : (
									"Submit Review"
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ReviewJourney;
