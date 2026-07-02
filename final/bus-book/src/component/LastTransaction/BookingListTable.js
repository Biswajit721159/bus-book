import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { getFormattedDate } from "../../utilities/date";

const BookingListTable = ({ data, currentPage, wishlistLoader, wishListId, onAddToWishList }) => {
	if (!data || data.length === 0) return null;

	return (
		<div className="table-container shadow-sm border border-surface-200 rounded-xl overflow-hidden bg-white">
			<div className="overflow-x-auto max-h-[600px]">
				<table className="table-base w-full border-collapse">
					<thead className="table-head bg-surface-50 sticky top-0 z-10 border-b border-surface-150">
						<tr>
							<th className="table-th w-12 text-center py-3.5">#</th>
							<th className="table-th py-3.5 text-left">Route</th>
							<th className="table-th py-3.5 text-left">Booking Date</th>
							<th className="table-th py-3.5 text-left">Total Distance</th>
							<th className="table-th py-3.5 text-left">Travel Date</th>
							<th className="table-th py-3.5 text-left">Amount</th>
							<th className="table-th py-3.5 text-center">Save Journey</th>
							<th className="table-th py-3.5 text-center">Actions</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-surface-100">
						{data.map((item, ind) => {
							const itemId = item.id || item._id;
							const sourceName = item?.sourceStation?.stationName || "-";
							const destName = item?.distStation?.stationName || "-";
							const isSaved = item.isWishlisted;

							return (
								<tr key={ind} className="table-row transition-colors hover:bg-surface-50/50">
									<td className="table-td text-surface-500 font-medium text-center py-4">
										{(currentPage - 1) * 10 + ind + 1}
									</td>
									<td className="table-td py-4">
										<div className="flex items-center gap-2">
											<div className="flex items-center gap-1.5">
												<span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
												<span className="text-sm font-semibold text-surface-800">
													{sourceName}
												</span>
											</div>
											<svg
												className="w-4 h-4 text-surface-400 flex-shrink-0"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M17 8l4 4m0 0l-4 4m4-4H3"
												/>
											</svg>
											<div className="flex items-center gap-1.5">
												<span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
												<span className="text-sm font-semibold text-surface-800">
													{destName}
												</span>
											</div>
										</div>
									</td>
									<td className="table-td text-surface-600 py-4">
										{getFormattedDate(item.bookingTime)}
									</td>
									<td className="table-td font-semibold text-surface-700 py-4">
										{item.totalDistance} km
									</td>
									<td className="table-td text-surface-600 py-4">
										{getFormattedDate(item.bookingDate)}
									</td>
									<td className="table-td py-4">
										<span className="text-sm font-bold text-green-700">
											₹{item.totalAmount}
										</span>
									</td>
									<td className="table-td text-center py-4">
										<div className="flex justify-center">
											{wishlistLoader && wishListId === itemId ? (
												<div className="w-8 h-8 flex items-center justify-center">
													<ClipLoader size={16} color="#d97706" />
												</div>
											) : (
												<button
													onClick={() => onAddToWishList(itemId, isSaved)}
													className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 ${
														isSaved
															? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
															: "bg-surface-100 text-surface-400 hover:bg-yellow-50 hover:text-yellow-500"
													}`}
													title={
														isSaved
															? "Remove from saved journeys"
															: "Save journey"
													}
												>
													<svg
														className={`w-4 h-4 ${isSaved ? "fill-yellow-500 text-yellow-500" : "fill-none text-current"}`}
														viewBox="0 0 24 24"
														stroke="currentColor"
														strokeWidth={2}
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
														/>
													</svg>
												</button>
											)}
										</div>
									</td>
									<td className="table-td text-center py-4">
										<div className="flex justify-center">
											<Link to={`/view-ticket/${itemId}`}>
												<button className="btn-primary btn-sm px-3.5 py-1.5 rounded-lg text-xs font-semibold">
													View Details
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
