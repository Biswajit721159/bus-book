import React from "react";
import Loader from "../Loader";
import { useMasterList } from "./useMasterList";
import PassengerTable from "./PassengerTable";
import AddPassengerModal from "./AddPassengerModal";
import EditPassengerModal from "./EditPassengerModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import EmptyMasterListState from "./EmptyMasterListState";

const MasterList = () => {
	const {
		data,
		filteredData,
		totalCount,
		loading,
		searchQuery,
		setSearchQuery,
		sortOption,
		setSortOption,
		name,
		nameError,
		setName,
		updateName,
		updateNameError,
		setUpdateName,
		openAddModal,
		openUpdateModal,
		submitLoading,
		deleteLoadingId,
		updateLoading,
		deleteModalOpen,
		deleteTarget,
		promptDelete,
		confirmDelete,
		cancelDelete,
		copyPassengerName,
		handleSubmit,
		handleUpdate,
		handleActualUpdate,
		handleOpenAddModal,
		handleCloseAddModal,
		handleCloseUpdateModal,
	} = useMasterList();

	return (
		<div className="min-h-[calc(100vh-64px)] bg-slate-50/70 py-8 sm:py-10">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Top Header Banner */}
				<div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="flex items-center gap-3.5">
						<div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
							<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<div>
							<div className="flex items-center gap-2.5">
								<h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
									Passenger Directory
								</h1>
								{!loading && totalCount > 0 && (
									<span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
										{totalCount} {totalCount === 1 ? "Saved" : "Saved"}
									</span>
								)}
							</div>
							<p className="text-xs sm:text-sm text-slate-500 mt-0.5">
								Manage verified passenger profiles for seamless 1-click booking and quick seat assignment
							</p>
						</div>
					</div>

					{/* Primary Add Passenger CTA */}
					<button
						type="button"
						onClick={handleOpenAddModal}
						className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-150 hover:scale-[1.02] cursor-pointer"
					>
						<svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
						</svg>
						<span>Add Passenger</span>
					</button>
				</div>

				{/* Table, Empty or Loading States */}
				{loading ? (
					<Loader text="Loading passenger profiles..." />
				) : data && data.length > 0 ? (
					<>
						{/* Control Toolbar: Search, Sort & View Mode Switcher */}
						<div className="bg-white rounded-2xl border border-slate-200/90 p-4 mb-6 shadow-2xs flex flex-wrap items-center justify-between gap-3">
							{/* Live Search Input */}
							<div className="relative flex-1 min-w-[220px] max-w-md">
								<svg
									className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
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
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search saved passenger by name..."
									className="w-full pl-10 pr-9 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
								/>
								{searchQuery && (
									<button
										type="button"
										onClick={() => setSearchQuery("")}
										className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
									>
										<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								)}
							</div>

							{/* Right Actions: Sort & View Toggle */}
							<div className="flex items-center gap-2.5 ml-auto">
								{/* Sort Selector */}
								<div className="flex items-center gap-1.5 text-xs text-slate-600">
									<span className="hidden sm:inline text-slate-400 font-medium">Sort:</span>
									<select
										value={sortOption}
										onChange={(e) => setSortOption(e.target.value)}
										className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
									>
										<option value="newest">Newest First</option>
										<option value="oldest">Oldest First</option>
										<option value="a-z">Name (A-Z)</option>
										<option value="z-a">Name (Z-A)</option>
									</select>
								</div>
							</div>
						</div>

						{/* Results List - Table View */}
						{filteredData && filteredData.length > 0 ? (
							<PassengerTable
								data={filteredData}
								deleteLoadingId={deleteLoadingId}
								onEditClick={handleUpdate}
								onDeleteClick={promptDelete}
								onCopyClick={copyPassengerName}
							/>
						) : (
							/* Empty Search State */
							<div className="bg-white border border-slate-200/90 rounded-3xl p-10 text-center shadow-xs flex flex-col items-center justify-center">
								<div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
									<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</div>
								<h3 className="text-base font-bold text-slate-900">
									No passengers found
								</h3>
								<p className="text-xs text-slate-500 mt-1 max-w-sm">
									No saved passenger matches your search &ldquo;
									<span className="font-semibold text-slate-700">{searchQuery}</span>
									&rdquo;.
								</p>
								<button
									type="button"
									onClick={() => setSearchQuery("")}
									className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
								>
									Clear Search Filter
								</button>
							</div>
						)}
					</>
				) : (
					/* Master Empty State */
					<EmptyMasterListState onAddClick={handleOpenAddModal} />
				)}
			</div>

			{/* Add Passenger Modal */}
			<AddPassengerModal
				isOpen={openAddModal}
				name={name}
				nameError={nameError}
				isLoading={submitLoading}
				onChangeName={(val) => setName(val)}
				onClose={handleCloseAddModal}
				onSubmit={handleSubmit}
			/>

			{/* Edit Passenger Modal */}
			<EditPassengerModal
				isOpen={openUpdateModal}
				name={updateName}
				nameError={updateNameError}
				isLoading={updateLoading}
				onChangeName={(val) => setUpdateName(val)}
				onClose={handleCloseUpdateModal}
				onSubmit={handleActualUpdate}
			/>

			{/* Safe Delete Confirmation Modal */}
			<DeleteConfirmModal
				isOpen={deleteModalOpen}
				target={deleteTarget}
				isLoading={deleteLoadingId !== null}
				onClose={cancelDelete}
				onConfirm={confirmDelete}
			/>
		</div>
	);
};

export default MasterList;
