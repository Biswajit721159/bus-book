import React from "react";
import { getRatingConfig } from "../utilities/rating";

const RatingBadge = ({ rating, count, size = "sm" }) => {
	const config = getRatingConfig(rating);
	const hasRating = Number(rating) > 0;

	return (
		<span
			className={`inline-flex items-center gap-1 rounded-full font-bold border transition-colors ${
				size === "md"
					? "px-2.5 py-1 text-xs"
					: "px-2 py-0.5 text-[10px]"
			} ${config.bg} ${config.text} ${config.border}`}
		>
			<svg
				className={`${size === "md" ? "w-3.5 h-3.5" : "w-3 h-3"} ${config.starColor}`}
				viewBox="0 0 20 20"
			>
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
			<span>{hasRating ? config.score : "New"}</span>
			{hasRating && count !== undefined && count !== null && (
				<span className={config.subText}>({count})</span>
			)}
		</span>
	);
};

export default RatingBadge;
