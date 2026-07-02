import React, { useState, useRef, useEffect } from "react";
import Portal from "./Portal";

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const CalendarPicker = ({ value, onChange, error }) => {
	const [open, setOpen] = useState(false);
	const [viewYear, setVY] = useState(() =>
		value ? parseInt(value.split("-")[0]) : new Date().getFullYear()
	);
	const [viewMonth, setVM] = useState(() =>
		value ? parseInt(value.split("-")[1]) - 1 : new Date().getMonth()
	);
	const [mode, setMode] = useState("day"); // 'day' | 'month' | 'year'
	const triggerRef = useRef(null);
	const containerRef = useRef(null);

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const todayStr = today.toISOString().split("T")[0];

	// sync view when value changes externally
	useEffect(() => {
		if (value) {
			setVY(parseInt(value.split("-")[0]));
			setVM(parseInt(value.split("-")[1]) - 1);
		}
	}, [value]);

	// close on outside click
	useEffect(() => {
		const h = (e) => {
			if (containerRef.current?.contains(e.target)) return;
			if (e.target.closest("[data-cal-panel]")) return;
			setOpen(false);
			setMode("day");
		};
		document.addEventListener("mousedown", h);
		return () => document.removeEventListener("mousedown", h);
	}, []);

	const open_ = () => {
		setOpen(true);
		setMode("day");
	};
	const close_ = () => {
		setOpen(false);
		setMode("day");
	};

	const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
	const firstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

	const toStr = (y, m, d) => {
		const mm = String(m + 1).padStart(2, "0");
		const dd = String(d).padStart(2, "0");
		return `${y}-${mm}-${dd}`;
	};

	const isPast = (y, m, d) => {
		const t = new Date(y, m, d);
		t.setHours(0, 0, 0, 0);
		return t < today;
	};

	const isSelected = (y, m, d) => value === toStr(y, m, d);
	const isToday = (y, m, d) => todayStr === toStr(y, m, d);

	const selectDay = (d) => {
		if (isPast(viewYear, viewMonth, d)) return;
		onChange(toStr(viewYear, viewMonth, d));
		close_();
	};

	const prevMonth = () => {
		if (viewMonth === 0) {
			setVM(11);
			setVY((y) => y - 1);
		} else setVM((m) => m - 1);
	};
	const nextMonth = () => {
		if (viewMonth === 11) {
			setVM(0);
			setVY((y) => y + 1);
		} else setVM((m) => m + 1);
	};

	const displayLabel = value
		? new Date(value + "T00:00:00").toLocaleDateString("en-IN", {
				day: "numeric",
				month: "short",
				year: "numeric",
			})
		: null;

	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

	const totalDays = daysInMonth(viewYear, viewMonth);
	const startDay = firstDayOfMonth(viewYear, viewMonth);
	const cells = [];
	for (let i = 0; i < startDay; i++) cells.push(null);
	for (let d = 1; d <= totalDays; d++) cells.push(d);
	while (cells.length % 7 !== 0) cells.push(null);

	return (
		<div ref={containerRef} className="flex-shrink-0 lg:w-48">
			{/* Trigger */}
			<button
				ref={triggerRef}
				type="button"
				onClick={open ? close_ : open_}
				className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left
          ${open ? "bg-primary-50 ring-2 ring-primary-400 ring-inset" : "hover:bg-surface-50"}
          ${error && !open ? "ring-2 ring-red-400 ring-inset" : ""}`}
			>
				<div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
					<svg
						className="w-4 h-4 text-blue-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2.5}
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-0.5">
						Date
					</p>
					{displayLabel ? (
						<p className="text-sm font-bold text-surface-900 truncate">{displayLabel}</p>
					) : (
						<p className="text-sm font-medium text-surface-400">Pick a date</p>
					)}
					{error && !open && <p className="text-xs text-red-500 mt-0.5">{typeof error === "string" ? error : (error.message || "This field is required")}</p>}
				</div>
				{value && (
					<span
						role="button"
						tabIndex={-1}
						onMouseDown={(e) => {
							e.stopPropagation();
							onChange("");
						}}
						className="w-5 h-5 rounded-full bg-surface-200 hover:bg-red-100 flex items-center justify-center text-surface-400 hover:text-red-500 transition-colors flex-shrink-0"
					>
						<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2.5}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</span>
				)}
			</button>

			{/* Calendar portal */}
			<Portal triggerRef={triggerRef} open={open} minWidth={300}>
				<div
					data-cal-panel="true"
					className="bg-white rounded-2xl border border-surface-200 overflow-hidden select-none"
					style={{
						width: 300,
						boxShadow: "0 20px 60px -10px rgba(0,0,0,0.22),0 4px 16px -4px rgba(0,0,0,0.10)",
					}}
				>
					{/* Header */}
					<div className="bg-gradient-to-r from-primary-600 to-primary-500 px-4 pt-4 pb-5">
						<p className="text-xs font-semibold text-primary-200 uppercase tracking-wider mb-1">
							Travel Date
						</p>
						{displayLabel ? (
							<p className="text-xl font-bold text-white">{displayLabel}</p>
						) : (
							<p className="text-xl font-bold text-primary-200">Select a date</p>
						)}
					</div>

					{/* Day view */}
					{mode === "day" && (
						<div className="p-3">
							{/* Month / Year nav */}
							<div className="flex items-center justify-between mb-3">
								<button
									type="button"
									onMouseDown={prevMonth}
									className="w-8 h-8 rounded-lg hover:bg-surface-100 flex items-center justify-center text-surface-500 hover:text-surface-800 transition-colors"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 19l-7-7 7-7"
										/>
									</svg>
								</button>

								<div className="flex items-center gap-1">
									<button
										type="button"
										onMouseDown={() => setMode("month")}
										className="px-2 py-1 rounded-lg text-sm font-bold text-surface-800 hover:bg-primary-50 hover:text-primary-700 transition-colors"
									>
										{MONTHS[viewMonth]}
									</button>
									<button
										type="button"
										onMouseDown={() => setMode("year")}
										className="px-2 py-1 rounded-lg text-sm font-bold text-surface-800 hover:bg-primary-50 hover:text-primary-700 transition-colors"
									>
										{viewYear}
									</button>
								</div>

								<button
									type="button"
									onMouseDown={nextMonth}
									className="w-8 h-8 rounded-lg hover:bg-surface-100 flex items-center justify-center text-surface-500 hover:text-surface-800 transition-colors"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							</div>

							{/* Day-of-week headers */}
							<div className="grid grid-cols-7 mb-1">
								{DAYS.map((d) => (
									<div
										key={d}
										className="text-center text-xs font-semibold text-surface-400 py-1"
									>
										{d}
									</div>
								))}
							</div>

							{/* Day cells */}
							<div className="grid grid-cols-7 gap-y-0.5">
								{cells.map((day, i) => {
									if (!day) return <div key={`e-${i}`} />;
									const past = isPast(viewYear, viewMonth, day);
									const sel = isSelected(viewYear, viewMonth, day);
									const tod = isToday(viewYear, viewMonth, day);
									return (
										<button
											key={day}
											type="button"
											onMouseDown={() => selectDay(day)}
											disabled={past}
											className={`
                        h-9 w-full rounded-lg text-sm font-medium transition-all duration-100
                        ${past ? "text-surface-300 cursor-not-allowed" : ""}
                        ${!past && !sel ? "text-surface-700 hover:bg-primary-50 hover:text-primary-700" : ""}
                        ${tod && !sel ? "ring-2 ring-primary-300 ring-inset text-primary-700 font-bold" : ""}
                        ${sel ? "bg-primary-600 text-white font-bold shadow-sm hover:bg-primary-700" : ""}
                      `}
										>
											{day}
										</button>
									);
								})}
							</div>

							{/* Today shortcut */}
							<div className="mt-3 pt-3 border-t border-surface-100 flex justify-between items-center">
								<button
									type="button"
									onMouseDown={() => {
										onChange(todayStr);
										close_();
									}}
									className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
								>
									Today
								</button>
								{value && (
									<button
										type="button"
										onMouseDown={() => onChange("")}
										className="text-xs text-surface-400 hover:text-red-500 transition-colors"
									>
										Clear
									</button>
								)}
							</div>
						</div>
					)}

					{/* Month picker */}
					{mode === "month" && (
						<div className="p-4">
							<div className="flex items-center justify-between mb-4">
								<p className="text-sm font-bold text-surface-800">Select Month</p>
								<button
									type="button"
									onMouseDown={() => setMode("day")}
									className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
								>
									Back
								</button>
							</div>
							<div className="grid grid-cols-3 gap-2">
								{MONTHS.map((m, idx) => (
									<button
										key={m}
										type="button"
										onMouseDown={() => {
											setVM(idx);
											setMode("day");
										}}
										className={`py-2 rounded-xl text-xs font-semibold transition-all duration-105
                      ${
							idx === viewMonth
								? "bg-primary-600 text-white shadow-sm"
								: "bg-surface-50 text-surface-700 hover:bg-primary-50 hover:text-primary-700"
						}`}
									>
										{m.slice(0, 3)}
									</button>
								))}
							</div>
						</div>
					)}

					{/* Year picker */}
					{mode === "year" && (
						<div className="p-4">
							<div className="flex items-center justify-between mb-4">
								<p className="text-sm font-bold text-surface-800">Select Year</p>
								<button
									type="button"
									onMouseDown={() => setMode("day")}
									className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
								>
									Back
								</button>
							</div>
							<div className="grid grid-cols-3 gap-2">
								{years.map((y) => (
									<button
										key={y}
										type="button"
										onMouseDown={() => {
											setVY(y);
											setMode("day");
										}}
										className={`py-2 rounded-xl text-xs font-semibold transition-all duration-105
                      ${
							y === viewYear
								? "bg-primary-600 text-white shadow-sm"
								: "bg-surface-50 text-surface-700 hover:bg-primary-50 hover:text-primary-700"
						}`}
									>
										{y}
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</Portal>
		</div>
	);
};

export default CalendarPicker;
