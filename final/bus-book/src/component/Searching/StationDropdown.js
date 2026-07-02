import React, { useState, useRef, useEffect } from "react";
import Portal from "./Portal";

export const StationDropdown = ({ value, onChange, stations, placeholder, label, icon, iconBg, error }) => {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [highlighted, setHl] = useState(0);
	const triggerRef = useRef(null);
	const containerRef = useRef(null);
	const inputRef = useRef(null);
	const listRef = useRef(null);

	const filtered = query.trim()
		? stations.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
		: stations;

	useEffect(() => {
		const h = (e) => {
			if (containerRef.current?.contains(e.target)) return;
			if (e.target.closest("[data-station-panel]")) return;
			setOpen(false);
			setQuery("");
		};
		document.addEventListener("mousedown", h);
		return () => document.removeEventListener("mousedown", h);
	}, []);

	useEffect(() => {
		setHl(0);
	}, [query]);

	useEffect(() => {
		if (!listRef.current) return;
		listRef.current.querySelector(`[data-idx="${highlighted}"]`)?.scrollIntoView({ block: "nearest" });
	}, [highlighted]);

	const open_ = () => {
		setOpen(true);
		setQuery("");
		setTimeout(() => inputRef.current?.focus(), 30);
	};
	const close_ = () => {
		setOpen(false);
		setQuery("");
	};
	const select = (s) => {
		onChange(s);
		close_();
	};
	const clearVal = (e) => {
		e.stopPropagation();
		onChange("");
		close_();
	};

	const onKey = (e) => {
		if (!open) return;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setHl((h) => Math.min(h + 1, filtered.length - 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setHl((h) => Math.max(h - 1, 0));
		} else if (e.key === "Enter") {
			e.preventDefault();
			if (filtered[highlighted]) select(filtered[highlighted]);
		} else if (e.key === "Escape") close_();
	};

	return (
		<div ref={containerRef} className="relative flex-1 min-w-0">
			<button
				ref={triggerRef}
				type="button"
				onClick={open ? close_ : open_}
				className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left
          ${open ? "bg-primary-50 ring-2 ring-primary-400 ring-inset" : "hover:bg-surface-50"}
          ${error && !open ? "ring-2 ring-red-400 ring-inset" : ""}`}
			>
				<div
					className={`flex-shrink-0 w-9 h-9 rounded-full ${iconBg} flex items-center justify-center`}
				>
					{icon}
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-0.5">
						{label}
					</p>
					{value ? (
						<p className="text-sm font-bold text-surface-900 truncate">{value}</p>
					) : (
						<p className="text-sm font-medium text-surface-400 truncate">{placeholder}</p>
					)}
					{error && !open && <p className="text-xs text-red-500 mt-0.5">{typeof error === "string" ? error : (error.message || "This field is required")}</p>}
				</div>
				<div className="flex-shrink-0 flex items-center gap-1">
					{value && (
						<span
							role="button"
							tabIndex={-1}
							onMouseDown={clearVal}
							className="w-5 h-5 rounded-full bg-surface-200 hover:bg-red-100 flex items-center justify-center text-surface-400 hover:text-red-500 transition-colors"
						>
							<svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2.5}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</span>
					)}
					<svg
						className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</div>
			</button>

			<Portal triggerRef={triggerRef} open={open}>
				<div
					data-station-panel="true"
					className="bg-white rounded-2xl border border-surface-200 overflow-hidden"
					style={{
						boxShadow: "0 20px 60px -10px rgba(0,0,0,0.22),0 4px 16px -4px rgba(0,0,0,0.10)",
					}}
				>
					{/* search */}
					<div className="p-3 border-b border-surface-100">
						<div className="flex items-center gap-2 px-3 py-2 bg-surface-50 rounded-xl">
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
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							<input
								ref={inputRef}
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								onKeyDown={onKey}
								placeholder={`Search ${label.toLowerCase()} station…`}
								className="flex-1 bg-transparent text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none"
							/>
							{query && (
								<button
									type="button"
									onMouseDown={() => setQuery("")}
									className="text-surface-400 hover:text-surface-600"
								>
									<svg
										className="w-3.5 h-3.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							)}
						</div>
					</div>
					{/* list */}
					<ul ref={listRef} className="max-h-52 overflow-y-auto py-1.5" role="listbox">
						{filtered.length > 0 ? (
							filtered.map((station, idx) => {
								const isSel = station === value;
								const isHl = idx === highlighted;
								const lq = query.toLowerCase();
								const ls = station.toLowerCase();
								const mi = lq ? ls.indexOf(lq) : -1;
								return (
									<li
										key={station}
										data-idx={idx}
										role="option"
										aria-selected={isSel}
										onMouseEnter={() => setHl(idx)}
										onMouseDown={() => select(station)}
										className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-75
                    ${isHl || isSel ? "bg-primary-50" : "hover:bg-surface-50"}`}
									>
										<div
											className={`w-2 h-2 rounded-full flex-shrink-0 ${isSel ? "bg-primary-500" : "bg-surface-300"}`}
										/>
										<span className="text-sm flex-1 min-w-0 truncate">
											{mi !== -1 && query ? (
												<>
													<span className="text-surface-500">
														{station.slice(0, mi)}
													</span>
													<span className="font-bold text-primary-700">
														{station.slice(mi, mi + query.length)}
													</span>
													<span className="text-surface-500">
														{station.slice(mi + query.length)}
													</span>
												</>
											) : (
												<span
													className={
														isSel
															? "font-semibold text-primary-700"
															: "text-surface-700"
													}
												>
													{station}
												</span>
											)}
										</span>
										{isSel && (
											<svg
												className="w-4 h-4 text-primary-600 flex-shrink-0"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
											</svg>
										)}
									</li>
								);
							})
						) : (
							<li className="px-4 py-8 text-center">
								<svg
									className="w-8 h-8 text-surface-300 mx-auto mb-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<p className="text-sm text-surface-400">
									No stations match <strong>"{query}"</strong>
								</p>
							</li>
						)}
					</ul>
					{/* hints */}
					<div className="px-4 py-2 border-t border-surface-100 bg-surface-50 flex items-center gap-3">
						{[
							["↑↓", "navigate"],
							["↵", "select"],
							["Esc", "close"],
						].map(([k, h]) => (
							<span key={k} className="flex items-center gap-1 text-xs text-surface-400">
								<kbd className="px-1.5 py-0.5 bg-white border border-surface-200 rounded font-mono text-xs">
									{k}
								</kbd>
								{h}
							</span>
						))}
					</div>
				</div>
			</Portal>
		</div>
	);
};

export default StationDropdown;
