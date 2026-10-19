import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BusSearchmethod } from "../../redux/BusSearchSlice";
import { fetchBusData } from "../../redux/BusSlice";

const popularRoutes = [
	{
		from: "Kolkata",
		to: "Siliguri",
		time: "11h 30m",
		type: "AC Sleeper (2+1)",
		price: "₹650",
		badge: "Popular",
	},
	{
		from: "Delhi",
		to: "Manali",
		time: "13h 45m",
		type: "Volvo Multi-Axle",
		price: "₹850",
		badge: "Scenic",
	},
	{
		from: "Bangalore",
		to: "Goa",
		time: "10h 15m",
		type: "Luxury AC Sleeper",
		price: "₹750",
		badge: "Weekend",
	},
	{
		from: "Mumbai",
		to: "Pune",
		time: "3h 30m",
		type: "Express Superfast",
		price: "₹350",
		badge: "Frequent",
	},
	{
		from: "Hyderabad",
		to: "Vijayawada",
		time: "5h 00m",
		type: "Deluxe AC Coach",
		price: "₹450",
		badge: "Daily",
	},
	{
		from: "Chennai",
		to: "Bangalore",
		time: "6h 15m",
		type: "Semi-Sleeper",
		price: "₹500",
		badge: "Top Rated",
	},
];

const EmptyHomeState = () => {
	const dispatch = useDispatch();
	const src = useSelector((state) => state.BusSearch.src);
	const dist = useSelector((state) => state.BusSearch.dist);

	const hasSearched = Boolean(src && dist);

	const handleSelectRoute = (from, to) => {
		dispatch(BusSearchmethod.Addsrc(from));
		dispatch(BusSearchmethod.adddist(to));
		dispatch(fetchBusData({ source: from, dist: to }));
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSwap = () => {
		const newSrc = dist;
		const newDist = src;
		dispatch(BusSearchmethod.Addsrc(newSrc));
		dispatch(BusSearchmethod.adddist(newDist));
		dispatch(fetchBusData({ source: newSrc, dist: newDist }));
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleClear = () => {
		dispatch(BusSearchmethod.clearsearch());
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div className="space-y-6 sm:space-y-8 animate-fade-in">
			{/* Case A: User searched but no buses were found on that route */}
			{hasSearched ? (
				<div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center">
					<div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center mx-auto mb-4">
						<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.75}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					</div>

					<span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">
						Route Query
					</span>

					<h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
						No direct buses found for {src} → {dist}
					</h3>
					<p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-2 mb-6 leading-relaxed">
						There are currently no active buses scheduled on this specific route for your chosen date. Try swapping directions, picking another date, or select one of our trending routes below.
					</p>

					<div className="flex flex-wrap items-center justify-center gap-3">
						<button
							type="button"
							onClick={handleSwap}
							className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
						>
							<svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
							</svg>
							Swap Route ({dist} → {src})
						</button>
						<button
							type="button"
							onClick={handleClear}
							className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
						>
							<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
							Reset Search
						</button>
					</div>
				</div>
			) : (
				/* Case B: Initial landing on search page before selecting route */
				<div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center">
					<div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto mb-4">
						<svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
							<path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z" />
						</svg>
					</div>

					<span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 text-xs font-bold uppercase tracking-wider mb-2">
						Ready For Your Next Trip
					</span>

					<h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
						Search for a route above or pick a destination
					</h3>
					<p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed">
						Select your departure city, destination, and travel date above to view real-time schedules, seat layouts, and operator ratings.
					</p>
				</div>
			)}

			{/* Popular Trending Routes Grid */}
			<div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
				<div className="flex flex-wrap items-center justify-between gap-3 mb-6">
					<div>
						<div className="flex items-center gap-2">
							<span className="w-2 h-2 rounded-full bg-blue-600" />
							<h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
								Popular Verified Routes
							</h4>
						</div>
						<p className="text-xs text-slate-500 mt-0.5">
							Click any route to instantly fill the search bar and load available buses
						</p>
					</div>
					<span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
						Instant Search
					</span>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{popularRoutes.map((route, idx) => (
						<div
							key={idx}
							onClick={() => handleSelectRoute(route.from, route.to)}
							className="group relative bg-slate-50 hover:bg-blue-50/40 border border-slate-200 hover:border-blue-400 rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between"
						>
							<div>
								{/* Header: Route & Tag */}
								<div className="flex items-center justify-between gap-2 mb-2.5">
									<span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 group-hover:border-blue-200 group-hover:text-blue-700 transition-colors">
										{route.badge}
									</span>
									<span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
										<svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										{route.time}
									</span>
								</div>

								{/* Cities */}
								<div className="flex items-center gap-2 mb-2">
									<span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
										{route.from}
									</span>
									<svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
									</svg>
									<span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
										{route.to}
									</span>
								</div>

								<p className="text-[11px] text-slate-500 mb-3">{route.type}</p>
							</div>

							{/* Bottom: Price & Action */}
							<div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
								<div>
									<span className="text-[10px] text-slate-400 font-medium block">Starting from</span>
									<span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
										{route.price}
									</span>
								</div>

								<span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-700">
									Select Route
									<svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
									</svg>
								</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* How it Works - 3 Step Guide */}
			<div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
				<div className="text-center max-w-md mx-auto mb-6">
					<h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
						Book in 3 Simple Steps
					</h4>
					<p className="text-xs text-slate-500 mt-1">
						Fast, secure, and hassle-free bus ticket reservations
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
						<div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
							1
						</div>
						<div>
							<h5 className="text-xs font-bold text-slate-900 mb-1">Search Your Route</h5>
							<p className="text-[11px] text-slate-500 leading-relaxed">
								Pick your departure station, arrival destination, and travel date above.
							</p>
						</div>
					</div>

					<div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
						<div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
							2
						</div>
						<div>
							<h5 className="text-xs font-bold text-slate-900 mb-1">Compare & Select Bus</h5>
							<p className="text-[11px] text-slate-500 leading-relaxed">
								View real operator ratings, coach amenities, departure times, and transparent fares.
							</p>
						</div>
					</div>

					<div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
						<div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
							3
						</div>
						<div>
							<h5 className="text-xs font-bold text-slate-900 mb-1">Pick Seat & Board</h5>
							<p className="text-[11px] text-slate-500 leading-relaxed">
								Select your seat on the interactive layout and get instant e-ticket on SMS & WhatsApp.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Travel Guarantees Strip */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				<div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5">
					<div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<div>
						<h6 className="text-[11px] font-bold text-slate-900">Verified Operators</h6>
						<p className="text-[10px] text-slate-400">Inspected coaches</p>
					</div>
				</div>

				<div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5">
					<div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
						</svg>
					</div>
					<div>
						<h6 className="text-[11px] font-bold text-slate-900">Instant M-Ticket</h6>
						<p className="text-[10px] text-slate-400">SMS & WhatsApp</p>
					</div>
				</div>

				<div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5">
					<div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
						</svg>
					</div>
					<div>
						<h6 className="text-[11px] font-bold text-slate-900">Zero Hidden Costs</h6>
						<p className="text-[10px] text-slate-400">Transparent pricing</p>
					</div>
				</div>

				<div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5">
					<div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
						</svg>
					</div>
					<div>
						<h6 className="text-[11px] font-bold text-slate-900">24/7 Helpline</h6>
						<p className="text-[10px] text-slate-400">Passenger assistance</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EmptyHomeState;
