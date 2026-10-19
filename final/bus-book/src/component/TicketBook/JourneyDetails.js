import React from "react";
import { Link } from "react-router-dom";

const JourneyDetails = ({ src, dist, date, totalDistance, MasterList }) => {
	const pricePerSeat = totalDistance * 5;

	return (
		<div className="space-y-4">
			{/* Journey Summary Card */}
			<div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
				<h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
					<svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
					</svg>
					<span>Trip Information</span>
				</h3>

				<div className="space-y-3.5 divide-y divide-slate-100">
					{/* Route details - stacked cleanly to prevent any overlap */}
					<div className="pt-1 space-y-1.5">
						<div className="flex justify-between items-center">
							<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Route</span>
							<span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
								Direct
							</span>
						</div>
						<div className="text-xs font-bold text-slate-900 flex items-center justify-between gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
							<span className="truncate flex-1" title={src}>{src}</span>
							<svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
							</svg>
							<span className="truncate flex-1 text-right" title={dist}>{dist}</span>
						</div>
					</div>

					<div className="flex justify-between items-center pt-3">
						<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</span>
						<span className="text-xs font-bold text-slate-800">{date}</span>
					</div>

					<div className="flex justify-between items-center pt-3">
						<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Distance</span>
						<span className="text-xs font-bold text-slate-800">{totalDistance} km</span>
					</div>

					<div className="flex justify-between items-center pt-3">
						<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Fare / Seat</span>
						<span className="text-sm font-extrabold text-blue-600">₹{pricePerSeat}</span>
					</div>
				</div>
			</div>

			{/* Passenger List Card */}
			<div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
				<div className="flex items-center justify-between mb-3">
					<h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
						<svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
						</svg>
						<span>Passenger List</span>
					</h3>
					<span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
						{MasterList.length} saved
					</span>
				</div>

				{MasterList.length > 0 ? (
					<div className="space-y-2 max-h-48 overflow-y-auto pr-1">
						{MasterList.map((p, i) => (
							<div
								key={i}
								className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition-colors"
							>
								<div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
									{p.name ? p.name[0].toUpperCase() : "P"}
								</div>
								<span className="text-xs font-semibold text-slate-800 truncate">{p.name}</span>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100 p-3">
						<p className="text-xs text-slate-500 mb-2">
							No saved passengers found in your passenger list.
						</p>
						<Link
							to="/master-list"
							className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
						>
							<span>+ Add Passenger</span>
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default JourneyDetails;
