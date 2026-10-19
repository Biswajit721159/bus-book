import React, { useEffect, useRef } from "react";

const StarRating = ({ rating, size = "w-4 h-4" }) => {
	return (
		<div className="flex items-center gap-0.5">
			{[1, 2, 3, 4, 5].map((star) => (
				<svg
					key={star}
					className={`${size} ${
						star <= Math.round(rating)
							? "text-amber-400 fill-amber-400"
							: "text-slate-200 fill-slate-200"
					}`}
					viewBox="0 0 20 20"
				>
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				</svg>
			))}
		</div>
	);
};

const BusReviewsList = ({
	reviews = [],
	averageRating = 0,
	totalReviewsCount = 0,
	totalElements = 0,
	loading = false,
	loadingMore = false,
	hasMore = false,
	onLoadMore = () => {},
}) => {
	const sentinelRef = useRef(null);

	const total = totalReviewsCount || totalElements || reviews.length || 0;
	const avg = averageRating
		? Number(averageRating).toFixed(1)
		: reviews.length > 0
		? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
		: "0.0";

	// Calculate star distribution
	const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
	reviews.forEach((r) => {
		if (r.rating >= 1 && r.rating <= 5) {
			starCounts[r.rating] = (starCounts[r.rating] || 0) + 1;
		}
	});

	const getPercentage = (count) => {
		if (!total || total === 0) return 0;
		return Math.round((count / (reviews.length || 1)) * 100);
	};

	const formatDate = (dateString) => {
		if (!dateString) return "Recent journey";
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
		} catch {
			return "Recent journey";
		}
	};

	// Intersection Observer for seamless Infinite Scroll
	useEffect(() => {
		if (!hasMore || loadingMore || loading) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0] && entries[0].isIntersecting) {
					onLoadMore();
				}
			},
			{
				root: null,
				rootMargin: "150px",
				threshold: 0.1,
			}
		);

		const currentSentinel = sentinelRef.current;
		if (currentSentinel) {
			observer.observe(currentSentinel);
		}

		return () => {
			if (currentSentinel) {
				observer.unobserve(currentSentinel);
			}
		};
	}, [hasMore, loadingMore, loading, onLoadMore]);

	return (
		<div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden mt-6">
			{/* Section Header */}
			<div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
						<svg className="w-4 h-4 fill-amber-500 text-amber-500" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
					</div>
					<div>
						<h2 className="text-base font-bold text-slate-900">Ratings & Reviews</h2>
						<p className="text-xs text-slate-500">Verified feedback from real passengers</p>
					</div>
				</div>
				<span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
					{total} {total === 1 ? "Review" : "Reviews"}
				</span>
			</div>

			{/* Ratings Overview Summary Card */}
			<div className="p-6 bg-gradient-to-b from-slate-50/70 to-white border-b border-slate-100">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
					{/* Overall Score Box */}
					<div className="md:col-span-4 flex flex-col items-center justify-center p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs text-center">
						<span className="text-4xl font-black text-slate-900 tracking-tight">
							{avg > 0 ? avg : "0.0"}
						</span>
						<div className="my-2">
							<StarRating rating={avg} size="w-5 h-5" />
						</div>
						<span className="text-xs font-medium text-slate-500">
							Based on {total} verified {total === 1 ? "rating" : "ratings"}
						</span>
					</div>

					{/* Rating Bars Breakdown */}
					<div className="md:col-span-8 space-y-2">
						{[5, 4, 3, 2, 1].map((star) => {
							const count = starCounts[star] || 0;
							const pct = getPercentage(count);
							return (
								<div key={star} className="flex items-center gap-3 text-xs">
									<div className="flex items-center gap-1 w-12 text-slate-700 font-semibold justify-end">
										<span>{star}</span>
										<svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									</div>
									<div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
										<div
											className="h-full bg-amber-400 rounded-full transition-all duration-500"
											style={{ width: `${pct}%` }}
										/>
									</div>
									<span className="w-10 text-right text-[11px] font-medium text-slate-500">
										{count}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Reviews List */}
			<div className="p-6">
				{loading ? (
					<div className="py-12 flex flex-col items-center justify-center">
						<div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mb-2" />
						<p className="text-xs text-slate-500">Loading verified reviews...</p>
					</div>
				) : reviews && reviews.length > 0 ? (
					<>
						<div className="divide-y divide-slate-100 space-y-4">
							{reviews.map((review, idx) => (
								<div key={review.id || idx} className="pt-4 first:pt-0">
									<div className="flex items-start justify-between gap-3 mb-2">
										<div className="flex items-center gap-3">
											<div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
												P{review.user ? String(review.user).slice(-2) : "X"}
											</div>
											<div>
												<div className="flex items-center gap-2">
													<h4 className="text-xs font-bold text-slate-900">
														Passenger #{review.user || idx + 1}
													</h4>
													<span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
														<svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
														</svg>
														Verified Booking
													</span>
												</div>
												<p className="text-[11px] text-slate-400 mt-0.5">
													{formatDate(review.createdAt)}
												</p>
											</div>
										</div>
										<StarRating rating={review.rating} size="w-3.5 h-3.5" />
									</div>
									{review.message && (
										<p className="text-xs text-slate-600 leading-relaxed pl-12">
											{review.message}
										</p>
									)}
								</div>
							))}
						</div>

						{/* Bottom Sentinel for Infinite Scroll */}
						<div ref={sentinelRef} className="h-4 w-full" />

						{/* Infinite Loading More Indicator */}
						{loadingMore && (
							<div className="py-4 mt-2 flex items-center justify-center gap-2 text-xs font-semibold text-blue-600">
								<div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
								<span>Loading more reviews...</span>
							</div>
						)}

						{/* Fallback "Load More" Button if user doesn't scroll */}
						{hasMore && !loadingMore && (
							<div className="mt-6 pt-3 text-center border-t border-slate-100">
								<button
									type="button"
									onClick={onLoadMore}
									className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer shadow-2xs"
								>
									<span>Load More Reviews</span>
									<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
									</svg>
								</button>
							</div>
						)}

						{/* End of reviews reached */}
						{!hasMore && reviews.length > 0 && (
							<div className="mt-8 pt-4 border-t border-slate-100 text-center">
								<p className="text-xs text-slate-400 font-medium">
									✓ All verified passenger reviews loaded ({reviews.length} total)
								</p>
							</div>
						)}
					</>
				) : (
					/* Empty State */
					<div className="py-10 text-center flex flex-col items-center justify-center">
						<div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mb-3 shadow-2xs">
							<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
							</svg>
						</div>
						<h3 className="text-sm font-bold text-slate-800">No Reviews Yet</h3>
						<p className="text-xs text-slate-500 max-w-sm mt-1">
							Be the first passenger to rate and review this bus after completing your journey!
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default BusReviewsList;
