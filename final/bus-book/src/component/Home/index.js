import React, { useState, useMemo } from "react";
import Loader from "../Loader";
import Searching from "../Searching";
import Filter from "../Filter";
import { useHome } from "./useHome";
import BusTableRow from "./BusTableRow";
import EmptyHomeState from "./EmptyHomeState";

const Home = () => {
	const {
		date,
		src,
		dist,
		Bus,
		loadingBus,
		loadingStation,
		busState,
		showSeat,
	} = useHome();

	const [searchQuery, setSearchQuery] = useState("");

	// Filter buses by bus name (case-insensitive substring match)
	const filteredBuses = useMemo(() => {
		if (!Bus || !Array.isArray(Bus)) return [];
		if (!searchQuery.trim()) return Bus;
		const query = searchQuery.toLowerCase().trim();
		return Bus.filter((b) => b.busName && b.busName.toLowerCase().includes(query));
	}, [Bus, searchQuery]);

	// Quick stats for route
	const lowestFare = Bus && Bus.length > 0 ? Math.min(...Bus.map((b) => (b.totalDistance || 10) * 5)) : null;

	return (
		<div className="min-h-[calc(100vh-64px)] bg-slate-50/70">
			{/* Search panel in compact mode */}
			<Searching isCompact={true} showHeroTag={false} showTrustBadges={false} />

			{/* Filter bar — only when results exist */}
			{!loadingBus && !loadingStation && Bus && Bus.length > 0 && <Filter />}

			{/* Results area */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
				{loadingBus || loadingStation ? (
					<Loader text="Searching available bus routes..." />
				) : Bus && Bus.length > 0 ? (
					<>
						{/* Results header & Controls Bar */}
						<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
							<div>
								<div className="flex items-center gap-2.5">
									<h2 className="text-xl sm:text-2xl font-extrabold text-surface-900 tracking-tight">
										{searchQuery.trim()
											? `Showing ${filteredBuses.length} of ${Bus.length} Buses`
											: `${Bus.length} ${Bus.length === 1 ? "Bus" : "Buses"} Available`}
									</h2>
									{lowestFare !== null && (
										<span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
											Fares from ₹{lowestFare}
										</span>
									)}
								</div>

								{src && dist && (
									<div className="flex flex-wrap items-center gap-2 mt-1">
										<span className="text-xs sm:text-sm text-surface-600 font-bold">{src}</span>
										<svg
											className="w-4 h-4 text-surface-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17 8l4 4m0 0l-4 4m4-4H3"
											/>
										</svg>
										<span className="text-xs sm:text-sm text-surface-600 font-bold">{dist}</span>
										{date && (
											<>
												<span className="text-surface-300">·</span>
												<span className="text-xs sm:text-sm font-bold text-blue-600">
													{date}
												</span>
											</>
										)}
									</div>
								)}
							</div>

							{/* Right Actions: Search by Bus Name + View Switcher */}
							<div className="flex flex-wrap items-center gap-3">
								{/* Search by Bus Name Input */}
								<div className="relative min-w-[220px] sm:min-w-[260px]">
									<svg
										className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
									<input
										type="text"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder="Search by bus name..."
										className="w-full pl-10 pr-9 py-2 bg-white hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
									/>
									{searchQuery && (
										<button
											type="button"
											onClick={() => setSearchQuery("")}
											className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-md"
											title="Clear search"
										>
											<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
											</svg>
										</button>
									)}
								</div>
							</div>
						</div>

						{/* Results Render: Table View */}
						{filteredBuses && filteredBuses.length > 0 ? (
							<div className="space-y-3.5">
								{filteredBuses.map((item, ind) => (
									<BusTableRow
										key={item.busId || ind}
										item={item}
										date={date}
										onShowSeat={showSeat}
										busState={busState}
									/>
								))}
							</div>
						) : (
							/* No buses matching search */
							<div className="bg-white border border-slate-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center my-6">
								<div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-3">
									<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</div>
								<h3 className="text-base font-bold text-slate-900">
									No buses matching &ldquo;{searchQuery}&rdquo;
								</h3>
								<p className="text-xs text-slate-500 mt-1 max-w-sm">
									We couldn't find any bus operator matching your search. Try checking for typos or searching by another name.
								</p>
								<button
									type="button"
									onClick={() => setSearchQuery("")}
									className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
								>
									Clear Search Filter
								</button>
							</div>
						)}
					</>
				) : (
					/* Empty state */
					<EmptyHomeState />
				)}
			</div>
		</div>
	);
};

export default Home;
