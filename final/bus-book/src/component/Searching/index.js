import React from "react";
import { useSearching } from "./useSearching";
import StationDropdown from "./StationDropdown";
import CalendarPicker from "./CalendarPicker";

export const Searching = () => {
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

	return (
		<div className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 pt-10 pb-16 px-4 sm:px-6 lg:px-8">
			{/* background decorative blobs */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				<div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
				<div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full" />
			</div>

			<div className="relative max-w-4xl mx-auto">
				<div className="text-center mb-8 animate-fade-in">
					<h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
						Find Your Bus
					</h1>
					<p className="text-primary-200 text-sm sm:text-base">
						Search from hundreds of routes across the country
					</p>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						findBus();
					}}
					className="bg-white rounded-2xl shadow-2xl p-2 sm:p-3"
				>
					<div className="flex flex-col lg:flex-row gap-1">
						{/* Departure Station Dropdown */}
						<StationDropdown
							value={src}
							onChange={handleSrcChange}
							stations={station}
							placeholder="Where are you from?"
							label="From"
							iconBg="bg-green-100"
							error={errors.src}
							icon={
								<svg
									className="w-4 h-4 text-green-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2.5}
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2.5}
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							}
						/>

						{/* Swap Desktop Action Button */}
						<div className="hidden lg:flex items-center justify-center flex-shrink-0 px-1">
							<div className="relative">
								<div className="w-px h-14 bg-surface-200" />
								<button
									type="button"
									onClick={swap}
									title="Swap stations"
									className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-surface-200 hover:border-primary-400 hover:bg-primary-50 flex items-center justify-center text-surface-500 hover:text-primary-600 transition-all duration-150 shadow-sm"
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
											strokeWidth={2.5}
											d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
										/>
									</svg>
								</button>
							</div>
						</div>

						{/* Swap Mobile Action Button */}
						<div className="lg:hidden flex justify-center py-1">
							<button
								type="button"
								onClick={swap}
								className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-100 hover:bg-primary-50 text-xs font-medium text-surface-600 hover:text-primary-600 transition-all duration-150"
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
										d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
									/>
								</svg>
								Swap
							</button>
						</div>

						{/* Destination Station Dropdown */}
						<StationDropdown
							value={dist}
							onChange={handleDistChange}
							stations={station}
							placeholder="Where are you going?"
							label="To"
							iconBg="bg-red-100"
							error={errors.dist}
							icon={
								<svg
									className="w-4 h-4 text-red-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2.5}
										d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
									/>
								</svg>
							}
						/>

						{/* Divider Line */}
						<div className="hidden lg:flex items-center flex-shrink-0 px-1">
							<div className="w-px h-14 bg-surface-200" />
						</div>

						{/* Calendar Date Picker Dropdown */}
						<CalendarPicker
							value={date}
							onChange={handleDateChange}
							error={errors.date}
						/>

						{/* Search Execution Button */}
						<div className="flex-shrink-0 flex items-stretch p-1">
							<button
								type="submit"
								disabled={disabled}
								className="w-full lg:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
							>
								<svg
									className="w-5 h-5"
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
								<span className="lg:hidden xl:inline">Search</span>
							</button>
						</div>
					</div>
				</form>

				{/* Bottom Trust Indicators & Clear search */}
				<div className="flex items-center justify-between mt-4 px-1">
					<div className="flex items-center gap-4">
						{[
							{ icon: "🛡️", text: "Safe & Verified" },
							{ icon: "⚡", text: "Instant Booking" },
							{ icon: "💳", text: "No Hidden Fees" },
						].map((item) => (
							<span
								key={item.text}
								className="hidden sm:flex items-center gap-1.5 text-xs text-primary-200"
							>
								<span>{item.icon}</span>
								{item.text}
							</span>
						))}
					</div>
					{(src || dist || date) && (
						<button
							type="button"
							onClick={clearSearch}
							className="flex items-center gap-1.5 text-xs text-primary-200 hover:text-white transition-colors"
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
							Clear search
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Searching;
