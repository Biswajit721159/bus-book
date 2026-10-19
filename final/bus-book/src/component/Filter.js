import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BusTablemethod } from "../redux/BusSlice";

const filterGroups = [
	{
		label: "Price",
		icon: (
			<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		),
		options: [
			{ key: "PriceLowFirst", label: "Cheapest first" },
			{ key: "PriceHighFirst", label: "Expensive first" },
		],
	},
	{
		label: "Duration",
		icon: (
			<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		),
		options: [
			{ key: "DurationEarlyFirst", label: "Shortest first" },
			{ key: "DurationLateFirst", label: "Longest first" },
		],
	},
	{
		label: "Departure",
		icon: (
			<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M5 10l7-7m0 0l7 7m-7-7v18"
				/>
			</svg>
		),
		options: [
			{ key: "DepartureEarlyFirst", label: "Earliest first" },
			{ key: "DepartureLateFirst", label: "Latest first" },
		],
	},
	{
		label: "Arrival",
		icon: (
			<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M19 14l-7 7m0 0l-7-7m7 7V3"
				/>
			</svg>
		),
		options: [
			{ key: "ArrivalEarlyFirst", label: "Earliest first" },
			{ key: "ArrivalLateFirst", label: "Latest first" },
		],
	},
	{
		label: "Rating",
		icon: (
			<svg className="w-3.5 h-3.5 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
		),
		options: [{ key: "RatingHighFirst", label: "Top Rated" }],
	},
];

const Filter = () => {
	const dispatch = useDispatch();
	const { Bus } = useSelector((state) => state.Bus);
	const [active, setActive] = useState(null);

	const applyFilter = (key) => {
		if (active === key) {
			// Toggle off filter
			setActive(null);
			if (typeof BusTablemethod.ResetFilter === "function") {
				dispatch(BusTablemethod.ResetFilter());
			}
		} else {
			setActive(key);
			if (typeof BusTablemethod[key] === "function") {
				dispatch(BusTablemethod[key](Bus));
			}
		}
	};

	const handleClear = () => {
		setActive(null);
		if (typeof BusTablemethod.ResetFilter === "function") {
			dispatch(BusTablemethod.ResetFilter());
		}
	};

	return (
		<div className="bg-white border-b border-surface-200 sticky top-16 lg:top-[70px] z-30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2.5">
					{/* Label */}
					<div className="flex items-center gap-1.5 flex-shrink-0 pr-3 border-r border-surface-200 mr-1">
						<svg className="w-3.5 h-3.5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
							/>
						</svg>
						<span className="text-xs font-bold text-surface-600 uppercase tracking-wider whitespace-nowrap">
							Sort & Filter
						</span>
					</div>

					{/* Filter groups */}
					{filterGroups.map((group) => (
						<div key={group.label} className="flex items-center gap-1 flex-shrink-0">
							<span className="flex items-center gap-1 text-xs text-surface-400 mr-0.5">
								{group.icon}
								<span className="hidden sm:inline font-medium">{group.label}:</span>
							</span>
							{group.options.map((opt) => (
								<button
									key={opt.key}
									type="button"
									onClick={() => applyFilter(opt.key)}
									className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 border cursor-pointer ${
										active === opt.key
											? "bg-blue-600 text-white border-blue-600 font-semibold"
											: "bg-white text-surface-600 border-surface-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
									}`}
								>
									{active === opt.key && (
										<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 011.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									)}
									{opt.label}
								</button>
							))}
						</div>
					))}

					{/* Separator + Clear */}
					{active && (
						<>
							<div className="w-px h-5 bg-surface-200 flex-shrink-0 mx-1" />
							<button
								type="button"
								onClick={handleClear}
								className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 hover:border-rose-300 transition-all duration-150 whitespace-nowrap flex-shrink-0 cursor-pointer"
							>
								<svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
								<span>Clear filter</span>
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Filter;
