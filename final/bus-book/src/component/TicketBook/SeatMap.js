import React from "react";

const SeatLegend = () => (
	<div className="flex items-center gap-4 flex-wrap">
		{[
			{ color: "bg-white border-surface-200", label: "Available" },
			{ color: "bg-primary-100 border-primary-500", label: "Selected" },
			{ color: "bg-red-50 border-red-200", label: "Booked" },
		].map((l) => (
			<div key={l.label} className="flex items-center gap-2">
				<div className={`w-5 h-5 rounded border-2 ${l.color}`} />
				<span className="text-xs text-surface-600">{l.label}</span>
			</div>
		))}
	</div>
);

const SeatMap = ({ data, seatarr, Mark, onContinue }) => {
	return (
		<div className="card p-6">
			<div className="flex items-center justify-between mb-5">
				<h2 className="font-semibold text-surface-900">Seat Map</h2>
				<SeatLegend />
			</div>

			{/* Bus front indicator */}
			<div className="flex items-center justify-center mb-4">
				<div className="flex items-center gap-2 px-4 py-2 bg-surface-100 rounded-lg text-xs text-surface-500 font-medium">
					<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
						<path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z" />
					</svg>
					Driver
				</div>
			</div>

			<div className="grid grid-cols-4 gap-2 sm:gap-3">
				{data?.map((item, ind) => {
					const seatNum = ind + 1;
					const isBooked = item.isBooked === true;
					const isSelected = item.isBooked === "Both";

					return (
						<button
							key={ind}
							onClick={() => !isBooked && Mark(seatNum)}
							disabled={isBooked}
							className={`
                relative flex flex-col items-center justify-center rounded-xl border-2 h-14 text-sm font-semibold
                transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1
                ${
					isBooked
						? "seat-booked cursor-not-allowed"
						: isSelected
							? "seat-selected shadow-sm"
							: "seat-available"
				}
              `}
							aria-label={`Seat ${seatNum} ${isBooked ? "(booked)" : isSelected ? "(selected)" : "(available)"}`}
						>
							<span>{seatNum}</span>
							{isBooked && (
								<svg
									className="w-3 h-3 mt-0.5 text-red-400"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							)}
							{isSelected && (
								<svg
									className="w-3 h-3 mt-0.5 text-primary-600"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
							)}
						</button>
					);
				})}
			</div>

			{seatarr.length > 0 && (
				<div className="mt-6 pt-5 border-t border-surface-100">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-surface-600">
								<span className="font-semibold text-surface-900">
									{seatarr.length}
								</span>{" "}
								seat(s) selected
								<span className="mx-2 text-surface-300">·</span>
								Seats:{" "}
								<span className="font-medium text-primary-700">
									{seatarr.join(", ")}
								</span>
							</p>
						</div>
						<button onClick={onContinue} className="btn-primary">
							Continue
							<svg
								className="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default SeatMap;
