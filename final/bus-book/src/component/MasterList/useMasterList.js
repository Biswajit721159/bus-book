import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllUsers, addUser, updateUser, deleteUser } from "../../apis/passengers";

export const useMasterList = () => {
	const userInfo = useSelector((state) => state.user);

	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortOption, setSortOption] = useState("newest"); // "newest", "oldest", "a-z", "z-a"

	const [name, setName] = useState("");
	const [nameError, setNameError] = useState("");
	const [updateName, setUpdateName] = useState("");
	const [updateNameError, setUpdateNameError] = useState("");
	const [openAddModal, setOpenAddModal] = useState(false);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [deleteLoadingId, setDeleteLoadingId] = useState(null);
	const [updateId, setUpdateId] = useState("");
	const [updateLoading, setUpdateLoading] = useState(false);

	// Delete confirmation modal state
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }

	const loadData = async () => {
		try {
			setLoading(true);
			const res = await getAllUsers();
			setData(res?.data || []);
		} catch (error) {
			toast.error(error?.message || "Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, [userInfo]);

	const validateName = (s) => /^[a-zA-Z\s]{3,50}$/.test(s && s.trim());

	const handleSubmit = async () => {
		const trimmed = name.trim();
		if (!trimmed) {
			setNameError("Passenger full name is required.");
			return;
		}
		if (trimmed.length < 3) {
			setNameError("Name must be at least 3 characters long.");
			return;
		}
		if (trimmed.length > 50) {
			setNameError("Name cannot exceed 50 characters.");
			return;
		}
		if (!validateName(trimmed)) {
			setNameError("Name must contain only letters and single spaces (no numbers or special characters).");
			return;
		}
		try {
			setSubmitLoading(true);
			const res = await addUser({ name: trimmed });
			setName("");
			setNameError("");
			setOpenAddModal(false);
			const created = res.data;
			setData((prev) => [created, ...prev]);
			toast.success(`Passenger "${trimmed}" added successfully!`);
		} catch (error) {
			toast.error(error?.message || "Failed to add passenger. Please try again.");
		} finally {
			setSubmitLoading(false);
		}
	};

	// Prompt delete confirmation modal
	const promptDelete = (id, targetName) => {
		setDeleteTarget({ id, name: targetName });
		setDeleteModalOpen(true);
	};

	const cancelDelete = () => {
		setDeleteModalOpen(false);
		setDeleteTarget(null);
	};

	// Direct delete or modal confirmed delete
	const confirmDelete = async () => {
		if (!deleteTarget?.id) return;
		const { id, name: targetName } = deleteTarget;
		try {
			setDeleteLoadingId(id);
			await deleteUser(id);
			setData((prev) => prev.filter((item) => (item.id || item._id) !== id));
			setDeleteModalOpen(false);
			setDeleteTarget(null);
			toast.success(`Passenger "${targetName || "profile"}" removed successfully.`);
		} catch (error) {
			toast.error(error?.message || "Failed to remove passenger.");
		} finally {
			setDeleteLoadingId(null);
		}
	};

	const handleDelete = async (id) => {
		const target = data.find((item) => (item.id || item._id) === id);
		promptDelete(id, target?.name);
	};

	const handleUpdate = (id, currentName) => {
		setUpdateId(id);
		setUpdateName(currentName);
		setUpdateNameError("");
		setOpenUpdateModal(true);
	};

	const handleActualUpdate = async () => {
		const trimmed = updateName.trim();
		if (!trimmed) {
			setUpdateNameError("Passenger full name is required.");
			return;
		}
		if (trimmed.length < 3) {
			setUpdateNameError("Name must be at least 3 characters long.");
			return;
		}
		if (trimmed.length > 50) {
			setUpdateNameError("Name cannot exceed 50 characters.");
			return;
		}
		if (!validateName(trimmed)) {
			setUpdateNameError("Name must contain only letters and single spaces (no numbers or special characters).");
			return;
		}
		try {
			setUpdateLoading(true);
			await updateUser(updateId, { name: trimmed });
			setData((prev) =>
				prev.map((item) =>
					(item.id || item._id) === updateId
						? { ...item, name: trimmed, updatedAt: new Date().toISOString() }
						: item,
				),
			);
			setOpenUpdateModal(false);
			toast.success("Passenger details updated successfully!");
		} catch (error) {
			toast.error(error?.message || "Failed to update passenger.");
		} finally {
			setUpdateLoading(false);
		}
	};

	const handleOpenAddModal = () => {
		setName("");
		setNameError("");
		setOpenAddModal(true);
	};

	const handleCloseAddModal = () => {
		setOpenAddModal(false);
		setNameError("");
	};

	const handleCloseUpdateModal = () => {
		setOpenUpdateModal(false);
		setUpdateNameError("");
	};

	const copyPassengerName = (passengerName) => {
		if (!passengerName) return;
		navigator.clipboard.writeText(passengerName);
		toast.info(`Copied "${passengerName}" to clipboard`, { autoClose: 1500 });
	};

	// Filter and Sort passengers
	const filteredData = useMemo(() => {
		if (!Array.isArray(data)) return [];
		let result = [...data];

		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase().trim();
			result = result.filter((item) => item.name && item.name.toLowerCase().includes(q));
		}

		if (sortOption === "a-z") {
			result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
		} else if (sortOption === "z-a") {
			result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
		} else if (sortOption === "oldest") {
			result.sort((a, b) => (a.id || 0) - (b.id || 0));
		} else {
			// newest (default)
			result.sort((a, b) => (b.id || 0) - (a.id || 0));
		}

		return result;
	}, [data, searchQuery, sortOption]);

	return {
		data,
		filteredData,
		totalCount: data?.length || 0,
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
		handleDelete,
		handleUpdate,
		handleActualUpdate,
		handleOpenAddModal,
		handleCloseAddModal,
		handleCloseUpdateModal,
		loadData,
	};
};

export default useMasterList;
