import React, { useState } from "react";
import { useSearching } from "./useSearching";
import StationDropdown from "./StationDropdown";
import CalendarPicker from "./CalendarPicker";

export const Searching = ({
	title = "Find Your Bus",
	subtitle = "Search from hundreds of verified luxury buses across the country",
	showHeroTag = false,
	showTrustBadges = false,
	isCompact = false,
}) => {
	const {
		src,
		dist,
		date,
		station,
		disabled,
		errors,
		findBus,
		clearSearch,
		swap,
		handleSrcChange,
		handleDistChange,
		handleDateChange,
	} = useSearching();

	const [isSwapping, setIsSwapping] = useState(false);

	const handleAnimatedSwap = () => {
		setIsSwapping(true);
		swap();
		setTimeout(() => setIsSwapping(false), 350);
	};

	return (
		<div className={`relative bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 text-white overflow-hidden ${isCompact ? "pt-6 pb-6 px-4 sm:px-6 lg:px-8" : "pt-8 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8"}`}>
			{/* Ambient lighting effect */}
			<div className="absolute inset-0 opacity-25 pointer-events-none">
				<div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400 rounded-full blur-3xl animate-pulse-slow" />
				<div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-400 rounded-full blur-3xl animate-pulse-slow" />
			</div>

			<div className="relative max-w-5xl mx-auto z-10">
				{/* Hero Title & Subtitle */}
				{!isCompact && (
					<div className="text-center mb-6 animate-fade-in">
						{showHeroTag && (
							<div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/15 backdrop-blur-md text-white text-[11px] font-bold rounded-full mb-2.5 border border-white/20 shadow-xs hover:bg-white/20 transition-all duration-200">
								<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
								<span>India's Trusted Online Bus Booking Platform</span>
							</div>
						)}
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 tracking-tight">
							{title}
						</h1>
						<p className="text-blue-100 text-xs sm:text-sm max-w-xl mx-auto font-normal leading-relaxed">
							{subtitle}
						</p>
					</div>
				)}

				{/* Elevated Floating Search Box */}
				<form
					onSubmit={(e) => {
						e.preventDefault();
						findBus();
					}}
					className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-xl border border-white/30 backdrop-blur-md animate-slide-up transition-all duration-300"
				>
					<div className="flex flex-col lg:flex-row items-stretch gap-1.5">
						{/* Departure Station Dropdown */}
						<StationDropdown
							value={src}
							onChange={handleSrcChange}
							stations={station}
							placeholder="Where are you from?"
							label="From"
							iconBg="bg-emerald-50 text-emerald-600"
							error={errors.src}
							icon={
								<svg
									className="w-5 h-5 text-emerald-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							}
						/>

						{/* Swap Desktop Action Button */}
						<div className="hidden lg:flex items-center justify-center flex-shrink-0 px-1.5 z-10">
							<button
								type="button"
								onClick={handleAnimatedSwap}
								title="Swap Departure and Destination"
								className={`w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all duration-300 shadow-sm cursor-pointer ${
									isSwapping ? "rotate-180 scale-110 text-blue-600 border-blue-500 bg-blue-50" : "hover:rotate-180 hover:scale-110 active:scale-95"
								}`}
							>
								<svg
									className="w-4 h-4 transition-transform"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
									/>
								</svg>
							</button>
						</div>

						{/* Swap Mobile Action Button */}
						<div className="lg:hidden flex justify-center py-0.5">
							<button
								type="button"
								onClick={handleAnimatedSwap}
								className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 text-xs font-bold text-slate-600 hover:text-blue-600 transition-all duration-200 ${
									isSwapping ? "scale-95 bg-blue-100 text-blue-700" : ""
								}`}
							>
								<svg
									className={`w-3.5 h-3.5 transition-transform duration-300 ${isSwapping ? "rotate-180" : ""}`}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
									/>
								</svg>
								<span>Swap Stations</span>
							</button>
						</div>

						{/* Destination Station Dropdown */}
						<StationDropdown
							value={dist}
							onChange={handleDistChange}
							stations={station}
							placeholder="Where are you going?"
							label="To"
							iconBg="bg-rose-50 text-rose-600"
							error={errors.dist}
							icon={
								<svg
									className="w-5 h-5 text-rose-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							}
						/>

						{/* Divider Line */}
						<div className="hidden lg:flex items-center flex-shrink-0 px-1">
							<div className="w-px h-12 bg-slate-200" />
						</div>

						{/* Calendar Date Picker Dropdown */}
						<CalendarPicker
							value={date}
							onChange={handleDateChange}
							error={errors.date}
						/>

						{/* Search Execution Button */}
						<div className="flex-shrink-0 flex items-stretch p-0.5">
							<button
								type="submit"
								disabled={disabled}
								className="w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-500 active:from-blue-800 active:to-indigo-800 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-95 cursor-pointer whitespace-nowrap group"
							>
								<svg
									className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2.5}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
								<span>Search Buses</span>
							</button>
						</div>
					</div>
				</form>

				{/* Single Sleek Trust & Features Strip */}
				{showTrustBadges && (
					<div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-white/15 text-white animate-fade-in">
						<div className="flex items-center justify-center gap-2 text-[11px] font-semibold bg-white/10 hover:bg-white/15 backdrop-blur-md py-2 px-3 rounded-xl border border-white/15 shadow-xs transition-all duration-200 hover:-translate-y-0.5">
							<svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
							<span>Verified Buses</span>
						</div>
						<div className="flex items-center justify-center gap-2 text-[11px] font-semibold bg-white/10 hover:bg-white/15 backdrop-blur-md py-2 px-3 rounded-xl border border-white/15 shadow-xs transition-all duration-200 hover:-translate-y-0.5">
							<svg className="w-3.5 h-3.5 text-sky-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
							<span>Instant E-Ticket</span>
						</div>
						<div className="flex items-center justify-center gap-2 text-[11px] font-semibold bg-white/10 hover:bg-white/15 backdrop-blur-md py-2 px-3 rounded-xl border border-white/15 shadow-xs transition-all duration-200 hover:-translate-y-0.5">
							<svg className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>Zero Hidden Fees</span>
						</div>
						<div className="flex items-center justify-center gap-2 text-[11px] font-semibold bg-white/10 hover:bg-white/15 backdrop-blur-md py-2 px-3 rounded-xl border border-white/15 shadow-xs transition-all duration-200 hover:-translate-y-0.5">
							<svg className="w-3.5 h-3.5 text-teal-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
							</svg>
							<span>24/7 Helpline</span>
						</div>
					</div>
				)}

				{/* Clear Search helper if active */}
				{(src || dist || date) && (
					<div className="flex justify-center mt-3 animate-fade-in">
						<button
							type="button"
							onClick={clearSearch}
							className="inline-flex items-center gap-1.5 text-xs text-blue-200 hover:text-white transition-all duration-150 bg-white/10 hover:bg-white/20 px-3.5 py-1 rounded-full border border-white/15 cursor-pointer hover:scale-105"
						>
							<svg
								className="w-3.5 h-3.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
							<span>Reset search criteria</span>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Searching;
