/**
 * Rating configuration helper for intuitive color-coded rating pills.
 *
 * Tier 1 (4.5 - 5.0): Emerald (Exceptional)
 * Tier 2 (4.0 - 4.4): Teal / Forest Green (Very Good)
 * Tier 3 (3.0 - 3.9): Warm Amber (Good / Average)
 * Tier 4 (2.0 - 2.9): Orange (Fair)
 * Tier 5 (0.1 - 1.9): Rose / Crimson (Poor)
 * Unrated (0 / null): Neutral Slate (New)
 */
export const getRatingConfig = (rating) => {
	const num = Number(rating) || 0;

	if (num >= 4.5) {
		return {
			score: num.toFixed(1),
			label: "Exceptional",
			bg: "bg-emerald-50",
			text: "text-emerald-800",
			border: "border-emerald-200",
			starColor: "text-emerald-600 fill-emerald-600",
			subText: "text-emerald-700/80",
			solidBg: "bg-emerald-600 text-white",
		};
	}
	if (num >= 4.0) {
		return {
			score: num.toFixed(1),
			label: "Very Good",
			bg: "bg-teal-50",
			text: "text-teal-800",
			border: "border-teal-200",
			starColor: "text-teal-600 fill-teal-600",
			subText: "text-teal-700/80",
			solidBg: "bg-teal-600 text-white",
		};
	}
	if (num >= 3.0) {
		return {
			score: num.toFixed(1),
			label: "Good",
			bg: "bg-amber-50",
			text: "text-amber-900",
			border: "border-amber-200",
			starColor: "text-amber-500 fill-amber-500",
			subText: "text-amber-800/80",
			solidBg: "bg-amber-500 text-white",
		};
	}
	if (num >= 2.0) {
		return {
			score: num.toFixed(1),
			label: "Fair",
			bg: "bg-orange-50",
			text: "text-orange-900",
			border: "border-orange-200",
			starColor: "text-orange-500 fill-orange-500",
			subText: "text-orange-800/80",
			solidBg: "bg-orange-500 text-white",
		};
	}
	if (num > 0) {
		return {
			score: num.toFixed(1),
			label: "Poor",
			bg: "bg-rose-50",
			text: "text-rose-900",
			border: "border-rose-200",
			starColor: "text-rose-600 fill-rose-600",
			subText: "text-rose-800/80",
			solidBg: "bg-rose-600 text-white",
		};
	}
	return {
		score: "New",
		label: "New",
		bg: "bg-slate-100",
		text: "text-slate-600",
		border: "border-slate-200",
		starColor: "text-slate-400 fill-slate-400",
		subText: "text-slate-400",
		solidBg: "bg-slate-500 text-white",
	};
};
