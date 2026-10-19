import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import { useViewBus } from "./useViewBus";
import BusInfoCard from "./BusInfoCard";
import RouteTimeline from "./RouteTimeline";
import BusReviewsList from "./BusReviewsList";
import RatingBadge from "../RatingBadge";

const ViewBus = () => {
	const {
		data,
		reviews,
		reviewTotalElements,
		reviewsLoading,
		loadingMore,
		hasMore,
		load,
		loadMoreReviews,
	} = useViewBus();
	const [activeTab, setActiveTab] = useState("all"); // "all", "route", "reviews"
	const navigate = useNavigate();

	const handleBack = (e) => {
		e.preventDefault();
		if (window.history.length > 2) {
			navigate(-1);
		} else {
			navigate("/book-bus");
		}
	};

	if (load) return <Loader text="Loading bus details..." />;

	const busName = data?.busName || "Bus Details";
	const reviewCount = data?.totalReviewsCount || reviewTotalElements || reviews?.length || 0;

	return (
		<div className="min-h-[calc(100vh-64px)] bg-surface-50">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-6">
					<button
						type="button"
						onClick={handleBack}
						className="btn-ghost text-sm mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-transparent hover:border-surface-200 cursor-pointer"
					>
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Back to Search
					</button>
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div>
							<h1 className="text-2xl font-bold text-surface-900">{busName}</h1>
							<p className="text-sm text-surface-500 mt-1">Bus route, schedules, and verified customer feedback</p>
						</div>
						{data?.averageRating !== undefined && data?.averageRating !== null ? (
							<RatingBadge rating={data.averageRating} count={reviewCount} size="md" />
						) : null}
					</div>
				</div>

				{/* Bus Info Card */}
				<BusInfoCard data={data} />

				{/* Navigation Tabs */}
				<div className="flex items-center gap-2 border-b border-slate-200 mt-6 mb-6">
					<button
						type="button"
						onClick={() => setActiveTab("all")}
						className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors relative ${
							activeTab === "all"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-slate-500 hover:text-slate-800"
						}`}
					>
						Overview & Route
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("reviews")}
						className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors relative flex items-center gap-1.5 ${
							activeTab === "reviews"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-slate-500 hover:text-slate-800"
						}`}
					>
						<span>Passenger Reviews</span>
						<span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
							{reviewCount}
						</span>
					</button>
				</div>

				{/* Tab Content: Route Timeline */}
				{(activeTab === "all" || activeTab === "route") && (
					<div className="mb-6">
						<RouteTimeline stations={data?.stations} />
					</div>
				)}

				{/* Tab Content: Customer Reviews */}
				{(activeTab === "all" || activeTab === "reviews") && (
					<BusReviewsList
						reviews={reviews}
						averageRating={data?.averageRating}
						totalReviewsCount={data?.totalReviewsCount}
						totalElements={reviewTotalElements}
						loading={reviewsLoading}
						loadingMore={loadingMore}
						hasMore={hasMore}
						onLoadMore={loadMoreReviews}
					/>
				)}
			</div>
		</div>
	);
};

export default ViewBus;
