import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BusSearchmethod } from "../redux/BusSearchSlice";
import { fetchBusData, loadBus } from "../redux/BusSlice";
import RatingBadge from "../component/RatingBadge";

const popularRoutes = [
	{
		from: "Kolkata",
		to: "Siliguri",
		time: "11h 30m",
		operator: "Royal Cruiser Volvo",
		type: "AC Sleeper (2+1)",
		price: "₹650",
		originalPrice: "₹850",
		rating: "4.9",
		tag: "Bestseller",
		amenities: ["Free WiFi", "Charging Port", "Blanket", "GPS Tracking"],
	},
	{
		from: "Delhi",
		to: "Manali",
		time: "13h 45m",
		operator: "Himalayan Express Multi-Axle",
		type: "Volvo Luxury Sleeper",
		price: "₹850",
		originalPrice: "₹1,100",
		rating: "4.8",
		tag: "Scenic Route",
		amenities: ["Climate AC", "Emergency Exit", "Water Bottle", "Recliner"],
	},
	{
		from: "Bangalore",
		to: "Goa",
		time: "10h 15m",
		operator: "IntrCity SmartBus Premium",
		type: "Executive AC Sleeper",
		price: "₹750",
		originalPrice: "₹950",
		rating: "4.9",
		tag: "Weekend Favorite",
		amenities: ["Free WiFi", "Live CCTV", "Clean Linen", "Snack Box"],
	},
	{
		from: "Mumbai",
		to: "Pune",
		time: "3h 30m",
		operator: "Shivneri Superfast Express",
		type: "Express AC Pushback",
		price: "₹350",
		originalPrice: "₹450",
		rating: "4.7",
		tag: "Every 30 Mins",
		amenities: ["Express Highway", "Pushback Seats", "Air Suspension"],
	},
	{
		from: "Hyderabad",
		to: "Vijayawada",
		time: "5h 00m",
		operator: "Kaveri Travels Gold Class",
		type: "Deluxe Multi-Axle AC",
		price: "₹450",
		originalPrice: "₹600",
		rating: "4.8",
		tag: "Fast Transit",
		amenities: ["USB Fast Charge", "Reading Lamp", "Spacious Legroom"],
	},
	{
		from: "Chennai",
		to: "Bangalore",
		time: "6h 15m",
		operator: "Greenline Electric Fleet",
		type: "Multi-Axle Semi-Sleeper",
		price: "₹500",
		originalPrice: "₹700",
		rating: "4.9",
		tag: "Top Rated",
		amenities: ["Eco-Friendly EV", "Quiet Cabin", "Free WiFi", "Live GPS"],
	},
];

const features = [
	{
		title: "Live Interactive Seat Map",
		desc: "Choose single lower/upper sleeper berths, double bunks, or aisle seats in real-time with zero guesswork.",
		icon: (
			<svg className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
			</svg>
		),
		bg: "bg-blue-50 border-blue-200/70 text-blue-600",
	},
	{
		title: "99.4% On-Time Reliability",
		desc: "Strict adherence to schedule with real-time GPS tracking and live boarding station updates on your phone.",
		icon: (
			<svg className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		),
		bg: "bg-emerald-50 border-emerald-200/70 text-emerald-600",
	},
	{
		title: "Zero Hidden Charges",
		desc: "Transparent fares. No surprise platform fees or checkout commissions. What you see is exactly what you pay.",
		icon: (
			<svg className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
			</svg>
		),
		bg: "bg-amber-50 border-amber-200/70 text-amber-600",
	},
	{
		title: "Instant Digital Tickets & Refunds",
		desc: "Receive confirmed e-tickets via SMS & WhatsApp instantly. Enjoy 1-click cancellations with rapid UPI bank refunds.",
		icon: (
			<svg className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
			</svg>
		),
		bg: "bg-indigo-50 border-indigo-200/70 text-indigo-600",
	},
];

const reviews = [
	{
		name: "Rahul Sen",
		route: "Kolkata → Siliguri",
		rating: 5.0,
		badge: "Verified Traveler",
		comment: "The AC sleeper was spotless and departed right on time from Esplanade. The live seat selection before booking made picking a single lower berth effortless!",
		date: "2 days ago",
	},
	{
		name: "Ananya Roy",
		route: "Bangalore → Goa",
		rating: 4.9,
		badge: "Frequent Traveler",
		comment: "Booking literally took 40 seconds on my phone. Received the WhatsApp e-ticket instantly with the bus captain contact number. Smooth highway drive!",
		date: "1 week ago",
	},
	{
		name: "Vikram Khanna",
		route: "Delhi → Manali",
		rating: 4.8,
		badge: "Holiday Traveler",
		comment: "Transparent pricing with no extra checkout fees. The Volvo 9600 was brand new, warm blankets were provided, and GPS tracking was 100% accurate.",
		date: "2 weeks ago",
	},
];

const Homepage2 = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { topRatedBuses, topRatedLoaded, loadingTopRated } = useSelector((state) => state.Bus);

	useEffect(() => {
		if (!topRatedLoaded && !loadingTopRated) {
			dispatch(loadBus());
		}
	}, [dispatch, topRatedLoaded, loadingTopRated]);

	const handleSelectRoute = (from, to) => {
		dispatch(BusSearchmethod.Addsrc(from));
		dispatch(BusSearchmethod.adddist(to));
		dispatch(fetchBusData({ source: from, dist: to }));
		navigate("/book-bus");
	};

	const displayRoutes = useMemo(() => {
		if (topRatedBuses && topRatedBuses.length > 0) {
			const TAG_LIST = [
				"Bestseller",
				"Top Rated",
				"Scenic Route",
				"Superfast",
				"Executive",
				"Weekend Favorite",
				"Popular Pick",
				"Express Highway",
				"Prime Choice",
				"Verified Operator",
			];
			const AMENITY_PRESETS = [
				["Free WiFi", "Charging Port", "Blanket", "GPS Tracking"],
				["Climate AC", "Emergency Exit", "Water Bottle", "Recliner"],
				["Free WiFi", "Live CCTV", "Clean Linen", "Snack Box"],
				["Express Highway", "Pushback Seats", "Air Suspension", "Reading Light"],
			];

			return topRatedBuses.slice(0, 9).map((bus, i) => {
				const dist = bus.totalDistance || 250;
				const price = Math.round(dist * 1.8);
				const originalPrice = Math.round(price * 1.3);
				const formattedTime = (bus.totalTime || "8h 00m").replace(":", " ");
				const rating = Number(bus.averageRating || 4.8).toFixed(1);

				return {
					from: bus.sourceStationName,
					to: bus.destinationStationName,
					time: formattedTime,
					operator: bus.busName,
					type: "Luxury AC Sleeper (2+1)",
					price: `₹${price}`,
					originalPrice: `₹${originalPrice}`,
					rating,
					reviewsCount: bus.totalReviewsCount,
					tag: TAG_LIST[i % TAG_LIST.length],
					amenities: AMENITY_PRESETS[i % AMENITY_PRESETS.length],
				};
			});
		}
		return popularRoutes.slice(0, 9);
	}, [topRatedBuses]);

	return (
		<div className="bg-slate-50/70 space-y-10 sm:space-y-12 py-8 sm:py-10">
			{/* 1. Popular Routes Section */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-wrap items-end justify-between gap-3 mb-5">
					<div>
						<span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
							Trending Departures
						</span>
						<h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
							Popular Bus Routes
						</h2>
						<p className="text-xs text-slate-500 mt-0.5">
							Explore India&apos;s top-rated intercity routes with verified customer reviews
						</p>
					</div>
					<button
						type="button"
						onClick={() => navigate("/book-bus")}
						className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer group transition-all"
					>
						<span>View all available routes</span>
						<svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4.5">
					{displayRoutes.map((route, i) => (
						<div
							key={i}
							className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-500/80 p-4 sm:p-4.5 transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5 relative overflow-hidden"
						>
							<div className="absolute top-0 right-0 w-20 h-20 bg-blue-50/50 rounded-bl-full pointer-events-none -z-0 group-hover:scale-125 group-hover:bg-blue-100/40 transition-all duration-300" />
							
							<div className="relative z-10">
								{/* Header pill tags */}
								<div className="flex items-center justify-between gap-2 mb-3">
									<span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
										{route.tag}
									</span>
									<div className="flex items-center gap-1.5">
										<RatingBadge rating={route.rating} count={route.reviewsCount} size="sm" />
										<span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/70">
											<svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
											<span>{route.time}</span>
										</span>
									</div>
								</div>

								{/* Cities from -> to */}
								<div className="flex items-center gap-2 font-black text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors my-1.5">
									<span>{route.from}</span>
									<div className="flex-1 flex items-center justify-center">
										<div className="w-full h-px bg-slate-200 relative overflow-visible">
											<svg className="w-3.5 h-3.5 text-blue-500 absolute -top-1.5 left-1/2 -translate-x-1/2 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
											</svg>
										</div>
									</div>
									<span>{route.to}</span>
								</div>

								<p className="text-[11px] text-slate-700 font-semibold mt-0.5 flex items-center gap-1.5">
									<svg className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
										<path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z"/>
									</svg>
									<span className="font-bold text-slate-900">{route.operator}</span>
									<span className="text-slate-400 font-normal">({route.type})</span>
								</p>

								{/* Amenities Micro Pills */}
								<div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-slate-100">
									{route.amenities.map((item, aIdx) => (
										<span key={aIdx} className="text-[10px] font-medium text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 px-1.5 py-0.5 rounded border border-slate-100 transition-colors duration-150">
											{item}
										</span>
									))}
								</div>
							</div>

							{/* Price & Book Button */}
							<div className="flex items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-100 relative z-10">
								<div>
									<div className="flex items-baseline gap-1.5">
										<span className="text-xl font-black text-slate-900 tracking-tight">{route.price}</span>
										<span className="text-xs text-slate-400 line-through font-semibold">{route.originalPrice}</span>
									</div>
									<span className="text-[10px] text-emerald-600 font-bold block">Instant Confirmation</span>
								</div>

								<button
									type="button"
									onClick={() => handleSelectRoute(route.from, route.to)}
									className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
								>
									<span>Book Bus</span>
									<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
									</svg>
								</button>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* 2. Key Stats Strip */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 rounded-2xl p-5 sm:p-6 text-white border border-blue-800">
					<div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
					<div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/15">
						<div className="pt-2 sm:pt-0 hover:scale-105 transition-transform duration-200">
							<p className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">500+</p>
							<p className="text-xs sm:text-sm font-bold text-white mt-0.5">Verified Bus Routes</p>
							<p className="text-[11px] text-blue-200 mt-0.5">Connecting all major Indian hubs</p>
						</div>
						<div className="pt-3 sm:pt-0 sm:pl-6 hover:scale-105 transition-transform duration-200">
							<p className="text-2xl sm:text-3xl font-black text-sky-300 tracking-tight">100,000+</p>
							<p className="text-xs sm:text-sm font-bold text-white mt-0.5">Happy Passengers</p>
							<p className="text-[11px] text-blue-200 mt-0.5">Smooth, verified journeys booked</p>
						</div>
						<div className="pt-3 sm:pt-0 sm:pl-6 hover:scale-105 transition-transform duration-200">
							<p className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">4.9 ★</p>
							<p className="text-xs sm:text-sm font-bold text-white mt-0.5">Average Trip Rating</p>
							<p className="text-[11px] text-blue-200 mt-0.5">Based on genuine reviews</p>
						</div>
						<div className="pt-3 sm:pt-0 sm:pl-6 hover:scale-105 transition-transform duration-200">
							<p className="text-2xl sm:text-3xl font-black text-teal-300 tracking-tight">24 / 7</p>
							<p className="text-xs sm:text-sm font-bold text-white mt-0.5">Passenger Care</p>
							<p className="text-[11px] text-blue-200 mt-0.5">Live WhatsApp & phone support</p>
						</div>
					</div>
				</div>
			</section>

			{/* 3. Why Choose Us (Value Pillars) */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-2xl mx-auto mb-6">
					<span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
						The BlueBus Advantage
					</span>
					<h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
						Why Millions Choose BlueBus
					</h2>
					<p className="text-xs text-slate-500 mt-1">
						Engineered for speed, seat accuracy, transparent fares, and 100% passenger peace of mind.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{features.map((feat, i) => (
						<div
							key={i}
							className="group bg-white rounded-2xl border border-slate-200/90 p-4.5 sm:p-5 flex flex-col justify-start hover:border-blue-400 transition-all duration-200 hover:-translate-y-0.5"
						>
							<div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-3 shadow-2xs group-hover:scale-110 transition-transform duration-200 ${feat.bg}`}>
								{feat.icon}
							</div>
							<h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
								{feat.title}
							</h3>
							<p className="text-xs text-slate-500 leading-relaxed">
								{feat.desc}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* 4. Travel Classes Overview */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-2xl mx-auto mb-6">
					<span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
						Luxury & Economy Fleet
					</span>
					<h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
						Comfort Tailored for Every Traveler
					</h2>
					<p className="text-xs text-slate-500 mt-1">
						Choose your preferred bus model, seating configuration, and onboard luxury.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
					<div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 sm:p-5 flex flex-col justify-between hover:border-blue-400 hover:-translate-y-0.5 transition-all duration-200">
						<div>
							<div className="flex items-center justify-between mb-3">
								<span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
									Ultra Luxury
								</span>
								<span className="text-[11px] font-medium text-slate-400">Night Sleeper</span>
							</div>
							<h3 className="text-sm sm:text-base font-black text-slate-900 mb-1">AC Sleeper (2+1)</h3>
							<p className="text-xs text-slate-500 leading-relaxed mb-3">
								Full flatbed sleeper berths with curtains, USB ports, sanitized pillows & blankets. Best for overnight journeys.
							</p>
							<div className="space-y-1.5 text-xs text-slate-700 font-medium">
								<div className="flex items-center gap-2">
									<span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
									<span>Upper & Lower single & double berths</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
									<span>Individual charging sockets & reading lamps</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
									<span>Full privacy curtains & luggage rack</span>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 sm:p-5 flex flex-col justify-between hover:border-blue-400 hover:-translate-y-0.5 transition-all duration-200">
						<div>
							<div className="flex items-center justify-between mb-3">
								<span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
									Executive Class
								</span>
								<span className="text-[11px] font-medium text-slate-400">All Highways</span>
							</div>
							<h3 className="text-sm sm:text-base font-black text-slate-900 mb-1">Volvo 9600 Multi-Axle</h3>
							<p className="text-xs text-slate-500 leading-relaxed mb-3">
								Ergonomic pushback semi-sleeper recliners with calf support and air suspension for maximum highway stability.
							</p>
							<div className="space-y-1.5 text-xs text-slate-700 font-medium">
								<div className="flex items-center gap-2">
									<span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
									<span>Multi-axle ultra-smooth highway ride</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
									<span>Climate controlled AC cabins</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
									<span>Spacious footrest & overhead bins</span>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 sm:p-5 flex flex-col justify-between hover:border-blue-400 hover:-translate-y-0.5 transition-all duration-200">
						<div>
							<div className="flex items-center justify-between mb-3">
								<span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200">
									Economy Express
								</span>
								<span className="text-[11px] font-medium text-slate-400">Day Trips</span>
							</div>
							<h3 className="text-sm sm:text-base font-black text-slate-900 mb-1">Intercity Express</h3>
							<p className="text-xs text-slate-500 leading-relaxed mb-3">
								Fast, frequent, and economical point-to-point buses designed for day travelers and quick business transit.
							</p>
							<div className="space-y-1.5 text-xs text-slate-700 font-medium">
								<div className="flex items-center gap-2">
									<span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
									<span>Direct point-to-point speed</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
									<span>Pocket-friendly ticket fares</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
									<span>High daily departure frequency</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 5. For Bus Operators & Fleet Partners (Dedicated Feature Section) */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white p-5 sm:p-8 lg:p-10 border border-blue-700/40">
					{/* Glowing ambient lights */}
					<div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
					<div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

					<div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
						<div className="lg:col-span-7 space-y-3.5">
							<div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
								<span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
								<span>Bus Operators & Fleet Partners</span>
							</div>

							<h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
								Grow Your Bus Fleet Business With BlueBus
							</h2>

							<p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
								Partner with India's fastest growing bus booking network. List your buses, customize seat matrices, manage route schedules, and receive instant daily settlements with 0% onboarding fee.
							</p>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
								<div className="flex items-start gap-2">
									<div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
										<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<span className="text-xs text-slate-200 font-semibold">Real-Time Fleet & Seat Control</span>
								</div>
								<div className="flex items-start gap-2">
									<div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
										<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<span className="text-xs text-slate-200 font-semibold">Daily Direct Bank Settlements</span>
								</div>
								<div className="flex items-start gap-2">
									<div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
										<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<span className="text-xs text-slate-200 font-semibold">Instant Passenger Manifests</span>
								</div>
								<div className="flex items-start gap-2">
									<div className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
										<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<span className="text-xs text-slate-200 font-semibold">24/7 Dedicated Partner Support</span>
								</div>
							</div>
						</div>

						{/* Interactive Partner Console Card */}
						<div className="lg:col-span-5 flex flex-col items-center justify-center">
							<div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4.5 sm:p-5 border border-white/15 w-full max-w-md space-y-3.5 hover:border-amber-400/30 transition-all duration-300">
								<div className="flex items-center justify-between border-b border-white/10 pb-2.5">
									<div className="flex items-center gap-2">
										<div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-2xs">
											<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
												<path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z"/>
											</svg>
										</div>
										<div>
											<p className="text-xs font-bold text-white">Partner Control Suite</p>
											<p className="text-[10px] text-slate-400">Live Operator Portal</p>
										</div>
									</div>
									<span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
										Active
									</span>
								</div>

								<div className="grid grid-cols-2 gap-2.5 py-0.5">
									<div className="p-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
										<p className="text-[9px] text-slate-400 uppercase font-semibold">Live Fleet</p>
										<p className="text-sm font-black text-white mt-0.5">18 Buses</p>
									</div>
									<div className="p-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
										<p className="text-[9px] text-slate-400 uppercase font-semibold">Daily Bookings</p>
										<p className="text-sm font-black text-emerald-400 mt-0.5">420+ Seats</p>
									</div>
								</div>

								<p className="text-xs text-slate-300 leading-relaxed">
									Already an authorized bus partner or want to register a new route? Access your operator dashboard now.
								</p>

								<a
									href={process.env.REACT_APP_BUS_OWNER_URL || "http://localhost:3001"}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black text-xs transition-all hover:scale-[1.02] active:scale-95 text-center cursor-pointer group shadow-sm"
								>
									<span>Open Bus Owner Portal</span>
									<svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
									</svg>
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 6. Verified Passenger Testimonials */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-2xl mx-auto mb-6">
					<span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
						Verified Testimonials
					</span>
					<h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
						Loved by Travelers Across India
					</h2>
					<p className="text-xs text-slate-500 mt-1">
						Genuine feedback from verified passengers who booked and traveled with BlueBus.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
					{reviews.map((rev, i) => (
						<div
							key={i}
							className="bg-white rounded-2xl border border-slate-200/90 p-4.5 sm:p-5 flex flex-col justify-between hover:border-blue-400 hover:-translate-y-0.5 transition-all duration-200"
						>
							<div>
								<div className="flex items-center justify-between gap-2 mb-2.5">
									<RatingBadge rating={rev.rating} size="sm" />
									<span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
								</div>
								<p className="text-xs text-slate-600 leading-relaxed mb-3">
									&ldquo;{rev.comment}&rdquo;
								</p>
							</div>

							<div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
								<div className="flex items-center gap-2.5">
									<div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black text-xs flex items-center justify-center shadow-2xs">
										{rev.name.charAt(0)}
									</div>
									<div>
										<h4 className="text-xs font-bold text-slate-900">{rev.name}</h4>
										<p className="text-[10px] text-slate-400">{rev.route}</p>
									</div>
								</div>
								<span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
									{rev.badge}
								</span>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
};

export default Homepage2;
