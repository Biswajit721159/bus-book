import React from "react";
import { Link } from "react-router-dom";
import { Spinner } from "../Loader";
import { formatReadableDate } from "../../utilities/date";

const BookingListTable = ({
	data,
	currentPage,
	wishlistLoader,
	wishListId,
	onAddToWishList,
}) => {
	if (!data || data.length === 0) return null;

	return (
		<div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden mb-6 animate-fade-in">
			<div className="overflow-x-auto">
				<table className="w-full border-collapse text-left text-sm">
					<thead>
						<tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
							<th className="py-4 px-5 text-center w-14">#</th>
							<th className="py-4 px-6">Bus & Route</th>
							<th className="py-4 px-6">Travel Date</th>
							<th className="py-4 px-6">Booked On</th>
							<th className="py-4 px-6">Fare & Distance</th>
							<th className="py-4 px-5 text-center w-24">Wishlist</th>
							<th className="py-4 px-6 text-center">Action</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{data.map((item, ind) => {
							const itemTicketIdentifier = item.pnrNumber || item.id || item._id;
							const busName = item?.bus?.busName || "Standard Bus";
							const sourceName = item?.sourceStation?.stationName || "Source";
							const destName = item?.distStation?.stationName || "Destination";
							const isSaved = item.isWishlisted;
							const indexNumber = (currentPage - 1) * 10 + ind + 1;

							return (
								<tr key={ind} className="hover:bg-blue-50/40 transition-colors duration-150 group">
									<td className="py-4 px-5 text-center text-xs font-bold text-slate-400">
										<span className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-700 inline-flex items-center justify-center font-black text-xs text-slate-600 transition-colors">
											{indexNumber}
										</span>
									</td>
									<td className="py-4 px-6">
										<div className="flex flex-col gap-1.5">
											<div className="flex items-center gap-2 flex-wrap">
												<span className="inline-flex items-center gap-1.5 text-xs font-black text-blue-900 bg-blue-50/90 border border-blue-200/70 px-2.5 py-0.5 rounded-lg shadow-2xs">
													<svg className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
														<path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z"/>
													</svg>
													<span>{busName}</span>
												</span>
											</div>
											<div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
												<div className="flex items-center gap-1.5">
													<span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200 flex-shrink-0" />
													<span>{sourceName}</span>
												</div>
												<div className="flex items-center justify-center px-1">
													<svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
													</svg>
												</div>
												<div className="flex items-center gap-1.5">
													<span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-200 flex-shrink-0" />
													<span>{destName}</span>
												</div>
											</div>
										</div>
									</td>
									<td className="py-4 px-6">
										<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 font-extrabold text-xs">
											<svg className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
											<span>{formatReadableDate(item.bookingDate)}</span>
										</div>
									</td>
									<td className="py-4 px-6">
										<span className="text-xs text-slate-500 font-medium">
											{formatReadableDate(item.bookingTime || item.bookingDate)}
										</span>
									</td>
									<td className="py-4 px-6">
										<div className="flex flex-col">
											<span className="text-base font-black text-slate-900 tracking-tight">₹{item.totalAmount}</span>
											<span className="text-[11px] text-slate-500 font-medium mt-0.5">{item.totalDistance || 0} km journey</span>
										</div>
									</td>
									<td className="py-4 px-5 text-center">
										<div className="flex justify-center">
											{wishlistLoader && wishListId === (item.id || item._id) ? (
												<div className="w-9 h-9 flex items-center justify-center">
													<Spinner size="xs" color="rose" />
												</div>
											) : (
												<button
													type="button"
													onClick={() => onAddToWishList(item.id || item._id, isSaved)}
													className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200 border cursor-pointer hover:scale-110 active:scale-95 shadow-2xs ${
														isSaved
															? "bg-rose-50 text-rose-600 border-rose-200 shadow-xs"
															: "bg-white text-slate-400 border-slate-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200"
													}`}
													title={isSaved ? "Saved to Wishlist" : "Save Journey"}
													aria-label={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
												>
													<svg className={`w-4 h-4 transition-colors ${isSaved ? "fill-rose-500 text-rose-500" : "fill-none text-current"}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
														<path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
													</svg>
												</button>
											)}
										</div>
									</td>
									<td className="py-4 px-6 text-center">
										<div className="flex justify-center">
											<Link to={`/view-ticket/${itemTicketIdentifier}`} state={{ fromPage: currentPage }}>
												<button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm hover:shadow-md hover:shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap">
													<span>View Ticket</span>
													<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
													</svg>
												</button>
											</Link>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default BookingListTable;
