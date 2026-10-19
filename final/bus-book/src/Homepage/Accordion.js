import React, { useState } from "react";

const faqs = [
	{
		q: "How do I get my bus ticket after booking?",
		a: "Once your payment is completed, your confirmed e-ticket with seat numbers, boarding station, and QR code is instantly sent via SMS and email. You can also view or download it anytime under 'Check Status' or 'My Bookings'.",
	},
	{
		q: "Can I choose my preferred seat before making payment?",
		a: "Yes, absolutely! BlueBus provides an interactive real-time seat layout for every bus. You can choose single sleeper berths, double bunks, window, or aisle seats with live availability before proceeding to payment.",
	},
	{
		q: "Do I need to carry a printed physical copy of the ticket?",
		a: "No physical printout is required. Showing your digital e-ticket on your mobile along with any valid photo ID (Aadhaar, Driving License, or Voter ID) is fully accepted by all bus operators.",
	},
	{
		q: "What is the cancellation and refund policy?",
		a: "You can easily cancel your booking from the 'Check Status' or 'My Bookings' section. Your refund is automatically processed back to your original payment source (UPI, Card, or Net Banking) according to operator cancellation terms.",
	},
	{
		q: "Are transactions on BlueBus safe and secure?",
		a: "Yes, 100% secure. All payments are encrypted using bank-grade 256-bit SSL protocols. We support all major Indian UPI apps (GPay, PhonePe, Paytm), Visa/Mastercard/RuPay debit & credit cards, and net banking.",
	},
	{
		q: "How do I track my bus or check boarding details?",
		a: "You can enter your Ticket ID on the 'Check Status' page anytime to view your boarding time, station address, bus operator contact, and real-time journey information.",
	},
];

const Accordion = () => {
	const [openIndex, setOpenIndex] = useState(0);

	return (
		<section className="py-10 sm:py-12 bg-white border-t border-slate-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
					{/* Left Column: Heading & Support Info (Col Span 5) */}
					<div className="lg:col-span-5 lg:sticky lg:top-24">
						<span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
							Got Questions?
						</span>
						<h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 mb-1.5">
							Frequently Asked Questions
						</h2>
						<p className="text-xs text-slate-500 leading-relaxed mb-5">
							Everything you need to know about booking, seat selection, cancellations, and refunds with BlueBus.
						</p>

						{/* Quick Help Box */}
						<div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4">
							<h3 className="text-xs font-bold text-slate-900 mb-0.5">
								Need immediate assistance?
							</h3>
							<p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
								Our passenger helpdesk is available 24 hours a day, 7 days a week.
							</p>
							<div className="space-y-1.5 text-xs">
								<div className="flex items-center gap-2 text-slate-700 font-semibold">
									<svg className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
									</svg>
									<span>1800-123-4567 (Toll-Free Helpline)</span>
								</div>
								<div className="flex items-center gap-2 text-slate-700 font-semibold">
									<svg className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
									<span>support@bluebus.in</span>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column: Accordion Questions (Col Span 7) */}
					<div className="lg:col-span-7">
						<div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
							{faqs.map((faq, i) => {
								const isOpen = openIndex === i;
								return (
									<div key={i} className="transition-colors">
										<button
											type="button"
											onClick={() => setOpenIndex(isOpen ? null : i)}
											className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 text-left transition-colors hover:bg-slate-50/70 cursor-pointer"
											aria-expanded={isOpen}
										>
											<span
												className={`text-xs sm:text-sm font-bold pr-4 transition-colors ${
													isOpen ? "text-blue-600" : "text-slate-900"
												}`}
											>
												{faq.q}
											</span>
											<div
												className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
													isOpen
														? "bg-blue-50 text-blue-600 rotate-180"
														: "bg-slate-100 text-slate-500"
												}`}
											>
												<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
												</svg>
											</div>
										</button>
										{isOpen && (
											<div className="px-4 sm:px-5 pb-4 pt-0.5">
												<p className="text-xs text-slate-600 leading-relaxed">
													{faq.a}
												</p>
											</div>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Accordion;
