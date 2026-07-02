const BusInfoCard = ({ data }) => {
	if (!data) return null;

	return (
		<div className="card p-6 mb-6 shadow-sm border border-surface-200 rounded-2xl bg-white">
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
				<div>
					<p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider mb-1">Bus Name</p>
					<p className="font-bold text-surface-900 text-sm">{data?.busName}</p>
				</div>
				<div>
					<p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider mb-1">Total Seats</p>
					<p className="font-bold text-surface-900 text-sm">{data?.totalSeat}</p>
				</div>
				<div>
					<p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider mb-1">Total Stations</p>
					<p className="font-bold text-surface-900 text-sm">{data?.stations?.length || 0}</p>
				</div>
				<div className="sm:col-span-3 pt-4 border-t border-surface-100 mt-2">
					<p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider mb-1">Bus ID</p>
					<p className="font-mono text-xs text-surface-600 break-all">{data?.busId}</p>
				</div>
			</div>
		</div>
	);
};

export default BusInfoCard;
