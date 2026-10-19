import { useState } from "react";
import { addReview } from "../../apis/review";
import { toast } from "react-toastify";
import { Spinner } from "../Loader";

const QUICK_TAGS = [
	{ label: "Clean & Hygenic", emoji: "🧼" },
	{ label: "On-time Departure", emoji: "⏱️" },
	{ label: "Polite Staff", emoji: "👨‍✈️" },
	{ label: "Comfortable Seats", emoji: "💺" },
	{ label: "Smooth Driving", emoji: "🛣️" },
	{ label: "Good AC", emoji: "❄️" },
];

const RATING_DESCRIPTIONS = {
	1: { title: "Poor", desc: "Significant issues during the journey", color: "text-rose-500 bg-rose-50 border-rose-200" },
	2: { title: "Fair", desc: "Below expectations, needs improvement", color: "text-amber-600 bg-amber-50 border-amber-200" },
	3: { title: "Good", desc: "Satisfactory and average experience", color: "text-blue-600 bg-blue-50 border-blue-200" },
	4: { title: "Very Good", desc: "Pleasant, smooth and comfortable", color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
	5: { title: "Exceptional", desc: "Outstanding service and comfort!", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
};

const ReviewJourney = ({ reviewData, bookingId, setReviewData }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [rating, setRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0);
	const [message, setMessage] = useState("");
	const [selectedTags, setSelectedTags] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const activeRating = hoverRating || rating;
	const activeMeta = RATING_DESCRIPTIONS[activeRating];

	const handleTagToggle = (tagLabel) => {
		let newTags;
		if (selectedTags.includes(tagLabel)) {
			newTags = selectedTags.filter((t) => t !== tagLabel);
		} else {
			newTags = [...selectedTags, tagLabel];
		}
		setSelectedTags(newTags);

		// If user hasn't typed much, helpfully pre-populate or append
		if (!message.includes(tagLabel)) {
			const separator = message.trim().length > 0 ? " • " : "";
			const newMsg = (message + separator + tagLabel).slice(0, 300);
			setMessage(newMsg);
		}
	};

	const handleSubmit = async () => {
		if (rating < 1 || rating > 5) {
			toast.error("Please provide a rating from 1 to 5 stars");
			return;
		}
		if (message.trim().length < 5) {
			toast.error("Review message must be at least 5 characters");
			return;
		}
		if (message.length > 300) {
			toast.error("Review message cannot exceed 300 characters");
			return;
		}

		try {
			setIsLoading(true);
			await addReview({ rating, bookingId, message: message.trim() });
			toast.success("Thank you! Review submitted successfully");
			setReviewData({ ...reviewData, status: true });
			setIsOpen(false);
		} catch (error) {
			toast.error(error?.message || "Failed to submit review. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	if (reviewData?.status) {
		return (
			<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
				<svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
						clipRule="evenodd"
					/>
				</svg>
				Reviewed
			</div>
		);
	}

	return (
		<>
			{/* Trigger Button */}
			<button
				onClick={() => setIsOpen(true)}
				className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-xs hover:shadow-md transition-all active:scale-95 group"
			>
				<svg
					className="w-3.5 h-3.5 text-amber-100 group-hover:rotate-12 transition-transform"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				</svg>
				Rate Trip
			</button>

			{/* Modal Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
					onClick={(e) => {
						if (e.target === e.currentTarget && !isLoading) setIsOpen(false);
					}}
				>
					<div
						className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-200 scale-100"
						role="dialog"
						aria-modal="true"
					>
						{/* Header Strip */}
						<div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-6 pt-6 pb-5 text-white">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300 shadow-inner">
										<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									</div>
									<div>
										<h3 className="text-lg font-bold text-white tracking-tight">Rate Your Journey</h3>
										<p className="text-xs text-blue-200 mt-0.5">
											Share your feedback to help other travelers
										</p>
									</div>
								</div>

								{/* Close Button */}
								<button
									onClick={() => !isLoading && setIsOpen(false)}
									disabled={isLoading}
									className="p-1.5 rounded-full text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
									aria-label="Close modal"
								>
									<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
						</div>

						{/* Modal Content */}
						<div className="p-6 space-y-6">
							{/* Star Rating Section */}
							<div className="flex flex-col items-center justify-center pt-1">
								<p className="text-xs font-semibold uppercase tracking-wider text-surface-400 mb-3">
									Overall Experience
								</p>

								{/* Interactive Stars */}
								<div className="flex items-center gap-2">
									{[1, 2, 3, 4, 5].map((star) => {
										const isFilled = star <= (hoverRating || rating);
										return (
											<button
												key={star}
												type="button"
												onClick={() => setRating(star)}
												onMouseEnter={() => setHoverRating(star)}
												onMouseLeave={() => setHoverRating(0)}
												className="p-1 transition-all duration-150 transform hover:scale-125 focus:outline-none"
												aria-label={`${star} star`}
											>
												<svg
													className={`w-10 h-10 transition-colors duration-150 ${
														isFilled
															? "text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]"
															: "text-slate-200 hover:text-amber-200"
													}`}
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
												</svg>
											</button>
										);
									})}
								</div>

								{/* Dynamic Sentiment Banner */}
								<div className="h-9 mt-3 flex items-center justify-center">
									{activeMeta ? (
										<div
											className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold border transition-all animate-fade-in ${activeMeta.color}`}
										>
											<span>{activeMeta.title}</span>
											<span className="text-surface-400 font-normal">•</span>
											<span className="font-normal text-surface-600">{activeMeta.desc}</span>
										</div>
									) : (
										<span className="text-xs text-surface-400 font-medium">Tap a star to rate</span>
									)}
								</div>
							</div>

							{/* Quick Highlight Chips */}
							<div>
								<label className="block text-xs font-bold uppercase tracking-wider text-surface-500 mb-2">
									Highlights & Compliments
								</label>
								<div className="flex flex-wrap gap-2">
									{QUICK_TAGS.map((tag) => {
										const isSelected = selectedTags.includes(tag.label);
										return (
											<button
												key={tag.label}
												type="button"
												onClick={() => handleTagToggle(tag.label)}
												className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
													isSelected
														? "bg-blue-600 text-white shadow-xs"
														: "bg-surface-50 hover:bg-surface-100 text-surface-700 border border-surface-200/80"
												}`}
											>
												<span>{tag.emoji}</span>
												<span>{tag.label}</span>
											</button>
										);
									})}
								</div>
							</div>

							{/* Written Feedback Textarea */}
							<div>
								<div className="flex items-center justify-between mb-2">
									<label className="text-xs font-bold uppercase tracking-wider text-surface-500">
										Detailed Feedback
									</label>
									<span
										className={`text-xs font-semibold ${
											message.length > 300
												? "text-rose-500"
												: message.length >= 5
												? "text-emerald-600"
												: "text-surface-400"
										}`}
									>
										{message.length}/300 chars
									</span>
								</div>

								<div className="relative">
									<textarea
										rows={4}
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										maxLength={300}
										placeholder="Describe your journey experience (bus condition, punctuality, driver behavior, comfort)..."
										className="w-full px-4 py-3 text-sm text-surface-900 bg-surface-50/50 border border-surface-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none shadow-xs"
									/>
								</div>
								{message.length > 0 && message.length < 5 && (
									<p className="text-[11px] text-amber-600 mt-1 font-medium">
										Please write at least 5 characters.
									</p>
								)}
							</div>
						</div>

						{/* Modal Footer */}
						<div className="px-6 py-4 bg-surface-50/80 border-t border-surface-100 flex items-center justify-end gap-3">
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								disabled={isLoading}
								className="px-5 py-2.5 rounded-xl text-xs font-bold text-surface-600 hover:text-surface-900 hover:bg-surface-200/60 border border-surface-200 transition-all active:scale-95"
							>
								Cancel
							</button>

							<button
								type="button"
								onClick={handleSubmit}
								disabled={isLoading || rating === 0 || message.trim().length < 5}
								className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
							>
								{isLoading ? (
									<>
										<Spinner size="xs" color="white" />
										<span>Submitting...</span>
									</>
								) : (
									<>
										<span>Submit Review</span>
										<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
										</svg>
									</>
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
