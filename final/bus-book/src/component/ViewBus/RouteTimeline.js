import React from "react";

const RouteTimeline = ({ stations }) => {
	if (!stations || stations.length === 0) return null;

	return (
		<div className="card p-6 shadow-sm border border-surface-200 rounded-2xl bg-white animate-slide-up">
			<h2 className="font-bold text-surface-900 text-lg mb-6">Route Stations</h2>
			<div className="relative pl-2">
				{stations.map((item, ind) => {
					const isFirst = ind === 0;
					const isLast = ind === stations.length - 1;

					return (
						<div key={ind} className="flex gap-4">
							{/* Timeline indicators */}
							<div className="flex flex-col items-center">
								<div
									className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
										isFirst
											? "bg-green-500 border-green-500"
											: isLast
												? "bg-red-500 border-red-500"
												: "bg-white border-primary-400"
									}`}
								/>
								{!isLast && (
									<div className="w-0.5 bg-surface-200 flex-1 my-1 min-h-[36px]" />
								)}
							</div>

							{/* Station detail items */}
							<div className={`pb-6 flex-1 ${isLast ? "pb-0" : ""}`}>
								<div className="flex items-start justify-between gap-4">
									<div>
										<p
											className={`font-semibold text-sm ${
												isFirst
													? "text-green-700 font-bold"
													: isLast
														? "text-red-700 font-bold"
														: "text-surface-800"
											}`}
										>
											{item.stationName}
											{isFirst && (
												<span className="ml-2 badge badge-green bg-green-50 text-green-700 border border-green-150 text-xs px-2 py-0.5 rounded-full font-medium">
													Origin
												</span>
											)}
											{isLast && (
												<span className="ml-2 badge badge-red bg-red-50 text-red-700 border border-red-150 text-xs px-2 py-0.5 rounded-full font-medium">
													Destination
												</span>
											)}
										</p>
										<p className="text-xs text-surface-500 mt-1">
											Arrives at{" "}
											<span className="font-medium text-surface-700">
												{item.arrivalTime}
											</span>
										</p>
									</div>
									{item.distanceFromLastStation > 0 && (
										<span className="badge badge-blue bg-blue-50 text-blue-700 border border-blue-150 text-xs px-2.5 py-0.5 rounded-full font-semibold flex-shrink-0">
											+{item.distanceFromLastStation} km
										</span>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default RouteTimeline;
