import React from "react";
import Loader from "../Loader";
import Searching from "../Searching";
import Filter from "../Filter";
import { useHome } from "./useHome";
import BusCard from "./BusCard";
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

	if (loadingBus || loadingStation) return <Loader />;

	return (
		<div className="min-h-[calc(100vh-64px)] bg-surface-50">
			{/* Hero search panel */}
			<Searching />

			{/* Filter bar — only when results exist */}
			{Bus && Bus.length > 0 && <Filter />}

			{/* Results area */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
				{Bus && Bus.length > 0 ? (
					<>
						{/* Results header */}
						<div className="flex items-center justify-between mb-6">
							<div>
								<h2 className="text-xl font-bold text-surface-900">
									{Bus.length} {Bus.length === 1 ? "Bus" : "Buses"} Available
								</h2>
								{src && dist && (
									<div className="flex items-center gap-2 mt-1">
										<span className="text-sm text-surface-500 font-semibold">{src}</span>
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
										<span className="text-sm text-surface-500 font-semibold">{dist}</span>
										{date && (
											<>
												<span className="text-surface-300">·</span>
												<span className="text-sm font-semibold text-primary-600">
													{date}
												</span>
											</>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Bus cards grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
							{Bus.map((item, ind) => (
								<BusCard
									key={ind}
									item={item}
									date={date}
									onShowSeat={showSeat}
									busState={busState}
								/>
							))}
						</div>
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
