import React from "react";
import Loader from "../Loader";
import { useMasterList } from "./useMasterList";
import PassengerTable from "./PassengerTable";
import AddPassengerModal from "./AddPassengerModal";
import EditPassengerModal from "./EditPassengerModal";
import EmptyMasterListState from "./EmptyMasterListState";

const MasterList = () => {
	const {
		data,
		loading,
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
		handleSubmit,
		handleDelete,
		handleUpdate,
		handleActualUpdate,
		handleOpenAddModal,
		handleCloseAddModal,
		handleCloseUpdateModal,
	} = useMasterList();

	if (loading) return <Loader text="Loading passengers..." />;

	return (
		<div className="min-h-[calc(100vh-64px)] bg-surface-50">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold text-surface-900">Passengers</h1>
						<p className="text-sm text-surface-500 mt-1">
							Manage your saved passenger list for quick booking
						</p>
					</div>
					<button
						onClick={handleOpenAddModal}
						className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-primary-700 transition-colors"
					>
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4v16m8-8H4"
							/>
						</svg>
						Add Passenger
					</button>
				</div>

				{data && data.length > 0 ? (
					/* Passenger list table */
					<PassengerTable
						data={data}
						deleteLoadingId={deleteLoadingId}
						onEditClick={handleUpdate}
						onDeleteClick={handleDelete}
					/>
				) : (
					/* Empty passenger view */
					<EmptyMasterListState onAddClick={handleOpenAddModal} />
				)}
			</div>

			{/* Add Passenger Modal window */}
			<AddPassengerModal
				isOpen={openAddModal}
				name={name}
				nameError={nameError}
				isLoading={submitLoading}
				onChangeName={(val) => setName(val)}
				onClose={handleCloseAddModal}
				onSubmit={handleSubmit}
			/>

			{/* Edit Passenger Modal window */}
			<EditPassengerModal
				isOpen={openUpdateModal}
				name={updateName}
				nameError={updateNameError}
				isLoading={updateLoading}
				onChangeName={(val) => setUpdateName(val)}
				onClose={handleCloseUpdateModal}
				onSubmit={handleActualUpdate}
			/>
		</div>
	);
};

export default MasterList;
