import React from "react";

const CardPaymentForm = ({
	cardNumber,
	handleCardNumberChange,
	cardName,
	setCardName,
	cardExpiry,
	handleExpiryChange,
	cardCvv,
	handleCvvChange,
	isCvvFocused,
	setIsCvvFocused,
}) => {
	return (
		<div className="space-y-4">
			{/* Interactive Card Mockup */}
			<div className="flex justify-center mb-6">
				<div
					className={`relative w-80 h-48 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 shadow-xl transition-all duration-500 transform ${
						isCvvFocused ? "rotate-y-180" : ""
					} preserve-3d`}
					style={{ perspective: "1000px" }}
				>
					{/* Card Front */}
					<div className={`absolute inset-0 p-3 flex flex-col justify-between backface-hidden ${isCvvFocused ? "opacity-0" : "opacity-100"}`}>
						<div className="flex justify-between items-center">
							<div className="w-10 h-7 bg-amber-400/80 rounded-md flex items-center justify-center opacity-90">
								{/* Microchip representation */}
								<div className="w-8 h-5 border border-slate-900/10 rounded-sm grid grid-cols-3 gap-0.5">
									{[...Array(6)].map((_, i) => (
										<div key={i} className="border border-slate-900/10 bg-amber-300/40" />
									))}
								</div>
							</div>
							<span className="text-sm font-bold tracking-widest text-indigo-200">SECURE CARD</span>
						</div>

						<div className="text-xl font-mono tracking-widest text-center my-3 text-white">
							{cardNumber || "•••• •••• •••• ••••"}
						</div>

						<div className="flex justify-between items-center text-xs">
							<div>
								<p className="text-[9px] uppercase tracking-wider text-indigo-300">Card Holder</p>
								<p className="font-semibold uppercase tracking-wider truncate max-w-[150px]">
									{cardName || "Your Name"}
								</p>
							</div>
							<div>
								<p className="text-[9px] uppercase tracking-wider text-indigo-300">Expires</p>
								<p className="font-semibold tracking-wider">{cardExpiry || "MM/YY"}</p>
							</div>
						</div>
					</div>

					{/* Card Back */}
					<div className={`absolute inset-0 flex flex-col justify-between py-5 backface-hidden rotate-y-180 ${isCvvFocused ? "opacity-100" : "opacity-0"}`}>
						<div className="w-full h-10 bg-black mt-2" />
						<div className="px-5">
							<p className="text-[8px] text-right uppercase tracking-wider text-indigo-300 mb-1">CVV</p>
							<div className="w-full h-8 bg-white text-slate-900 flex items-center justify-end px-3 font-mono text-sm font-bold tracking-widest rounded-md">
								{cardCvv || "•••"}
							</div>
						</div>
						<div className="px-5 text-[8px] text-indigo-200/50 flex justify-between">
							<span>AUTHORIZED SIGNATURE</span>
							<span>SECURE PAYMENT</span>
						</div>
					</div>
				</div>
			</div>

			{/* Form Fields */}
			<div>
				<label className="label">Card Number</label>
				<input
					type="text"
					placeholder="0000 0000 0000 0000"
					value={cardNumber}
					onChange={handleCardNumberChange}
					className="input-field font-mono"
					required
				/>
			</div>

			<div>
				<label className="label">Cardholder Name</label>
				<input
					type="text"
					placeholder="John Doe"
					value={cardName}
					onChange={(e) => setCardName(e.target.value.slice(0, 24))}
					className="input-field"
					required
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="label">Expiry Date</label>
					<input
						type="text"
						placeholder="MM/YY"
						value={cardExpiry}
						onChange={handleExpiryChange}
						className="input-field font-mono"
						required
					/>
				</div>
				<div>
					<label className="label">CVV</label>
					<input
						type="password"
						placeholder="•••"
						value={cardCvv}
						onChange={handleCvvChange}
						onFocus={() => setIsCvvFocused(true)}
						onBlur={() => setIsCvvFocused(false)}
						className="input-field font-mono"
						required
					/>
				</div>
			</div>
		</div>
	);
};

export default CardPaymentForm;
