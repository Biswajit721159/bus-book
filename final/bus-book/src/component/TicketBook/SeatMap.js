import React from "react";

const SeatLegend = ({ availableCount = 0, selectedCount = 0, bookedCount = 0 }) => (
	<div className="flex items-center justify-center sm:justify-start gap-4 flex-wrap bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl">
		{/* Available */}
		<div className="flex items-center gap-2">
			<div className="w-4 h-4 rounded-md border-2 border-slate-300 bg-white shadow-xs" />
			<span className="text-xs font-semibold text-slate-700">
				Available <span className="text-slate-400 font-bold">({availableCount})</span>
			</span>
		</div>

		{/* Selected */}
		<div className="flex items-center gap-2">
			<div className="w-4 h-4 rounded-md bg-blue-600 border border-blue-600 shadow-xs flex items-center justify-center">
				<svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
						clipRule="evenodd"
					/>
				</svg>
			</div>
			<span className="text-xs font-semibold text-blue-700">
				Selected {selectedCount > 0 && <span className="font-bold">({selectedCount})</span>}
			</span>
		</div>

		{/* Booked */}
		<div className="flex items-center gap-2">
			<div className="w-4 h-4 rounded-md bg-red-50 border-2 border-red-300 text-red-500 flex items-center justify-center shadow-xs">
				<svg className="w-2.5 h-2.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clipRule="evenodd"
					/>
				</svg>
			</div>
			<span className="text-xs font-semibold text-red-600">
				Booked <span className="text-red-400 font-bold">({bookedCount})</span>
			</span>
		</div>
	</div>
);

const BusSeat = ({ seatNum, isBooked, isSelected, onClick, price }) => {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isBooked}
			aria-label={`Seat ${seatNum} ${isBooked ? "(booked)" : isSelected ? "(selected)" : "(available)"}`}
			className={`
				group relative flex flex-col items-center justify-between p-2 rounded-xl transition-all duration-150 focus:outline-none select-none min-h-[56px] sm:min-h-[64px]
				${
					isBooked
						? "bg-red-50/80 border-2 border-red-200 text-red-500 cursor-not-allowed opacity-85 shadow-none"
						: isSelected
							? "bg-blue-600 text-white border-2 border-blue-600 shadow-md shadow-blue-500/30 ring-2 ring-blue-400/40 scale-105 z-10"
							: "bg-white border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-slate-800 hover:shadow-md hover:scale-105 active:scale-95"
				}
			`}
		>
			{/* Headrest Accent */}
			<div
				className={`w-6 h-1 rounded-full mb-1 transition-colors ${
					isBooked
						? "bg-red-200"
						: isSelected
							? "bg-blue-300"
							: "bg-slate-200 group-hover:bg-blue-200"
				}`}
			/>

			{/* Seat Number */}
			<span
				className={`text-sm font-bold leading-tight ${
					isSelected
						? "text-white"
						: isBooked
							? "text-red-700"
							: "text-slate-900 group-hover:text-blue-600"
				}`}
			>
				{seatNum}
			</span>

			{/* Bottom Status / Price */}
			<div className="flex items-center justify-center mt-0.5">
				{isSelected ? (
					<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clipRule="evenodd"
						/>
					</svg>
				) : isBooked ? (
					<span className="text-[9px] font-bold text-red-600 uppercase tracking-tight">
						Sold
					</span>
				) : (
					<span className="text-[10px] font-medium text-slate-400 group-hover:text-blue-600">
						₹{price}
					</span>
				)}
			</div>
		</button>
	);
};

const SeatMap = ({ data, seatarr, Mark, onContinue, totalDistance = 0 }) => {
	const pricePerSeat = totalDistance * 5;
	const totalSelectedPrice = seatarr.length * pricePerSeat;

	// Calculate live statistics
	const totalSeats = data?.length || 0;
	const bookedCount = data ? data.filter((s) => s.isBooked === true).length : 0;
	const availableCount = totalSeats - bookedCount;
	const selectedCount = seatarr.length;

	// Chunk data into rows of 4 for a 2+2 layout
	const rows = [];
	if (data && data.length > 0) {
		for (let i = 0; i < data.length; i += 4) {
			rows.push(data.slice(i, i + 4));
		}
	}

	return (
		<div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
				<div>
					<h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
						<span>Seat Layout</span>
						<span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
							{availableCount} Available
						</span>
					</h2>
					<p className="text-xs text-slate-500 mt-1">
						Select up to 5 seats to continue your booking
					</p>
				</div>
				<SeatLegend
					availableCount={availableCount}
					selectedCount={selectedCount}
					bookedCount={bookedCount}
				/>
			</div>

			{/* Bus Coach Container */}
			<div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-4 sm:p-6">
				{/* Cabin / Front Indicator */}
				<div className="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-slate-200/80 mb-5 shadow-2xs">
					<span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
						Entrance
					</span>
					<div className="flex items-center gap-1.5">
						<span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
						<span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
							Front
						</span>
					</div>
					<div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
						<svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<circle cx="12" cy="12" r="9" strokeWidth="2" />
							<circle cx="12" cy="12" r="3" strokeWidth="2" />
							<path strokeLinecap="round" strokeWidth="2" d="M12 3v6M12 15v6M3 12h6M15 12h6" />
						</svg>
						<span>Driver</span>
					</div>
				</div>

				{/* 2 + 2 Seating Rows */}
				<div className="space-y-2.5">
					{rows.map((rowItems, rowIndex) => {
						const leftPair = rowItems.slice(0, 2);
						const rightPair = rowItems.slice(2, 4);

						return (
							<div
								key={rowIndex}
								className="flex items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs"
							>
								{/* Left Pair */}
								<div className="grid grid-cols-2 gap-2 flex-1">
									{leftPair.map((item, colIndex) => {
										const seatNum = rowIndex * 4 + colIndex + 1;
										const isBooked = item.isBooked === true;
										const isSelected = item.isBooked === "Both";

										return (
											<BusSeat
												key={seatNum}
												seatNum={seatNum}
												isBooked={isBooked}
												isSelected={isSelected}
												onClick={() => !isBooked && Mark(seatNum)}
												price={pricePerSeat}
											/>
										);
									})}
								</div>

								{/* Aisle */}
								<div className="w-6 flex items-center justify-center text-[10px] font-bold text-slate-300 select-none">
									{rowIndex + 1}
								</div>

								{/* Right Pair */}
								<div className="grid grid-cols-2 gap-2 flex-1">
									{rightPair.map((item, colIndex) => {
										const seatNum = rowIndex * 4 + 2 + colIndex + 1;
										const isBooked = item.isBooked === true;
										const isSelected = item.isBooked === "Both";

										return (
											<BusSeat
												key={seatNum}
												seatNum={seatNum}
												isBooked={isBooked}
												isSelected={isSelected}
												onClick={() => !isBooked && Mark(seatNum)}
												price={pricePerSeat}
											/>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>

				{/* Rear */}
				<div className="text-center mt-4 pt-2">
					<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
						Back of Bus
					</span>
				</div>
			</div>

			{/* Bottom Selection Summary Bar */}
			{seatarr.length > 0 && (
				<div className="mt-6 pt-5 border-t border-slate-200 animate-slide-up">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-50/70 p-4 rounded-2xl border border-blue-200/80">
						{/* Seat details */}
						<div className="flex items-center gap-3">
							<div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
								{seatarr.length}
							</div>
							<div>
								<p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
									Selected Seats
								</p>
								<div className="flex items-center gap-1.5 flex-wrap mt-0.5">
									{seatarr.map((s) => (
										<span
											key={s}
											className="px-2.5 py-0.5 rounded-lg bg-white border border-blue-300 text-xs font-bold text-blue-700 shadow-2xs"
										>
											Seat {s}
										</span>
									))}
								</div>
							</div>
						</div>

						{/* Price and CTA */}
						<div className="flex items-center justify-between sm:justify-end gap-4">
							<div className="text-left sm:text-right">
								<p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
									Total Price
								</p>
								<p className="text-xl font-extrabold text-slate-900 leading-tight">
									₹{totalSelectedPrice}
								</p>
							</div>
							<button
								type="button"
								onClick={onContinue}
								className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-150 hover:scale-[1.02] active:scale-95"
							>
								<span>Proceed</span>
								<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default SeatMap;
