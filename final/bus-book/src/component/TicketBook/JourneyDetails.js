import React from "react";

const JourneyDetails = ({ src, dist, date, totalDistance, MasterList }) => {
	return (
		<div className="space-y-4">
			<div className="card p-5">
				<h3 className="font-semibold text-surface-900 mb-4">Journey Details</h3>
				<div className="space-y-3">
					{[
						{ label: "From", value: src },
						{ label: "To", value: dist },
						{ label: "Date", value: date },
						{ label: "Distance", value: `${totalDistance} km` },
						{ label: "Price/seat", value: `₹${totalDistance * 5}` },
					].map((d) => (
						<div key={d.label} className="flex justify-between items-center">
							<span className="text-xs text-surface-500">{d.label}</span>
							<span className="text-sm font-medium text-surface-800">
								{d.value}
							</span>
						</div>
					))}
				</div>
			</div>

			<div className="card p-5">
				<h3 className="font-semibold text-surface-900 mb-3">Passengers Available</h3>
				{MasterList.length > 0 ? (
					<div className="space-y-2">
						{MasterList.map((p, i) => (
							<div
								key={i}
								className="flex items-center gap-2 text-sm text-surface-700"
							>
								<div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
									{p.name[0].toUpperCase()}
								</div>
								{p.name}
							</div>
						))}
					</div>
				) : (
					<p className="text-sm text-surface-500">
						No passengers in your list. Add passengers in the Passengers section.
					</p>
				)}
			</div>
		</div>
	);
};

export default JourneyDetails;
