import React from "react";
import Searching from "../component/Searching";

const Homepage1 = () => {
	return (
		<section className="relative bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-900 overflow-hidden text-white">
			{/* Soft background ambient lighting and subtle grid */}
			<div className="absolute inset-0 opacity-15 pointer-events-none">
				<div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-500/25 rounded-full blur-3xl" />
				<div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-indigo-500/25 rounded-full blur-3xl" />
				<div
					className="absolute inset-0"
					style={{
						backgroundImage:
							"radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
						backgroundSize: "24px 24px",
					}}
				/>
			</div>

			{/* Main Hero Searching Component */}
			<div className="relative z-10 pb-4">
				<Searching
					title="Travel Smarter, Book Faster"
					subtitle="Compare verified luxury buses, choose live seat layouts, and confirm your ticket in under 60 seconds."
					showHeroTag={true}
					showTrustBadges={true}
				/>
			</div>
		</section>
	);
};

export default Homepage1;
