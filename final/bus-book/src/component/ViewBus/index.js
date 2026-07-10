import React from "react";
import { Link } from "react-router-dom";
import Loader from "../Loader";
import { useViewBus } from "./useViewBus";
import BusInfoCard from "./BusInfoCard";
import RouteTimeline from "./RouteTimeline";

const ViewBus = () => {
	const { data, load } = useViewBus();

	if (load) return <Loader text="Loading bus details..." />;

	const busName = data?.busName || "Bus Details";

	return (
		<div className="min-h-[calc(100vh-64px)] bg-surface-50">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-6">
					<Link to="/book-bus" className="btn-ghost text-sm mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-transparent hover:border-surface-200">
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Back to Search
					</Link>
					<h1 className="text-2xl font-bold text-surface-900">{busName}</h1>
					<p className="text-sm text-surface-500 mt-1">Bus route and station details</p>
				</div>

				{/* Bus Info Card */}
				<BusInfoCard data={data} />

				{/* Route Timeline */}
				<RouteTimeline stations={data?.stations} />
			</div>
		</div>
	);
};

export default ViewBus;
