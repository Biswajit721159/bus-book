import React from "react";
import Loader from "../Loader";

import PaymentSummary from "./PaymentSummary";
import CardPaymentForm from "./CardPaymentForm";
import UpiPaymentForm from "./UpiPaymentForm";
import NetBankingPaymentForm from "./NetBankingPaymentForm";
import { usePayment } from "./usePayment";

const Payment = () => {
	const {
		navigate,
		src,
		dist,
		date,
		seat_record,
		person,
		total_money,
		totalDistance,
		activeTab,
		setActiveTab,
		submitload,
		cardNumber,
		cardName,
		setCardName,
		cardExpiry,
		cardCvv,
		isCvvFocused,
		setIsCvvFocused,
		upiId,
		setUpiId,
		selectedBank,
		setSelectedBank,
		handleCardNumberChange,
		handleExpiryChange,
		handleCvvChange,
		handlePaymentSubmit,
	} = usePayment();

	if (submitload) return <Loader text="Processing your secure payment..." />;

	return (
		<div className="min-h-[calc(100vh-64px)] bg-surface-50 py-8">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Top Navigation & Breadcrumb Header */}
				<div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<button
							type="button"
							onClick={() => navigate(-1)}
							className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 transition-colors mb-3 shadow-2xs"
						>
							<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
							</svg>
							<span>Back to Seat Map</span>
						</button>
						<h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
							<span>Secure Payment</span>
							<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
						</h1>
						<p className="text-xs text-slate-500 mt-1">
							Choose your preferred payment method to complete your ticket reservation
						</p>
					</div>

					{/* 256-bit Security Pill */}
					<div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-emerald-800 text-xs font-semibold">
						<svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
						</svg>
						<span>Bank-Grade 256-Bit SSL</span>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
					{/* Left: Payment Method Selection & Form */}
					<div className="lg:col-span-3 space-y-6">
						<div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
							{/* Segmented Method Tabs */}
							<div className="grid grid-cols-3 gap-2 bg-slate-100/80 p-1.5 rounded-2xl mb-6">
								<button
									type="button"
									onClick={() => setActiveTab("card")}
									className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all duration-150 ${
										activeTab === "card"
											? "bg-white text-blue-700 shadow-sm"
											: "text-slate-600 hover:text-slate-900"
									}`}
								>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
									</svg>
									<span>Cards</span>
								</button>
								<button
									type="button"
									onClick={() => setActiveTab("upi")}
									className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all duration-150 ${
										activeTab === "upi"
											? "bg-white text-blue-700 shadow-sm"
											: "text-slate-600 hover:text-slate-900"
									}`}
								>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
									</svg>
									<span>UPI / QR</span>
								</button>
								<button
									type="button"
									onClick={() => setActiveTab("netbanking")}
									className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all duration-150 ${
										activeTab === "netbanking"
											? "bg-white text-blue-700 shadow-sm"
											: "text-slate-600 hover:text-slate-900"
									}`}
								>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
									</svg>
									<span>Net Banking</span>
								</button>
							</div>

							{/* Form Actions */}
							<form onSubmit={handlePaymentSubmit} className="space-y-6">
								{activeTab === "card" && (
									<CardPaymentForm
										cardNumber={cardNumber}
										handleCardNumberChange={handleCardNumberChange}
										cardName={cardName}
										setCardName={setCardName}
										cardExpiry={cardExpiry}
										handleExpiryChange={handleExpiryChange}
										cardCvv={cardCvv}
										handleCvvChange={handleCvvChange}
										isCvvFocused={isCvvFocused}
										setIsCvvFocused={setIsCvvFocused}
									/>
								)}

								{activeTab === "upi" && <UpiPaymentForm upiId={upiId} setUpiId={setUpiId} />}

								{activeTab === "netbanking" && (
									<NetBankingPaymentForm
										selectedBank={selectedBank}
										setSelectedBank={setSelectedBank}
									/>
								)}

								{/* Primary Pay Action Button */}
								<div className="pt-2">
									<button
										type="submit"
										className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-sm font-black rounded-2xl shadow-lg shadow-blue-700/25 transition-all duration-150 hover:scale-[1.01] active:scale-95 cursor-pointer"
									>
										<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
										</svg>
										<span>Pay ₹{total_money} & Confirm Booking</span>
									</button>
								</div>
							</form>
						</div>
					</div>

					{/* Right: Booking Summary Receipt Card */}
					<div className="lg:col-span-2">
						<PaymentSummary
							src={src}
							dist={dist}
							date={date}
							totalDistance={totalDistance}
							seat_record={seat_record}
							person={person}
							total_money={total_money}
						/>
					</div>
				</div>
			</div>

			{/* Rotate Credit Card styling helper */}
			<style>{`
				.rotate-y-180 {
					transform: rotateY(180deg);
				}
				.backface-hidden {
					backface-visibility: hidden;
					-webkit-backface-visibility: hidden;
				}
				.preserve-3d {
					transform-style: preserve-3d;
				}
			`}</style>
		</div>
	);
};

export default Payment;
