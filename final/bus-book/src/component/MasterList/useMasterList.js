import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllUsers, addUser, updateUser, deleteUser } from "../../apis/passengers";

export const useMasterList = () => {
	const userInfo = useSelector((state) => state.user);

	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
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

	const loadData = async () => {
		try {
			setLoading(true);
			const res = await getAllUsers();
			setData(res.data);
		} catch (error) {
			toast.error(error?.message || "Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, [userInfo]);

	const validateName = (s) => /^[a-zA-Z ]{3,50}$/.test(s);

	const handleSubmit = async () => {
		if (!validateName(name)) {
			setNameError("Name must contain only letters, 3–50 characters, no numbers or symbols.");
			return;
		}
		try {
			setSubmitLoading(true);
			const res = await addUser({ name });
			setName("");
			setOpenAddModal(false);
			setData((prev) => [...prev, res.data]);
			toast.success("Passenger added successfully");
		} catch (error) {
			toast.error(error?.message || "Something went wrong. Please try again.");
		} finally {
			setSubmitLoading(false);
		}
	};

	const handleDelete = async (id) => {
		try {
			setDeleteLoadingId(id);
			await deleteUser(id);
			setData((prev) => prev.filter((item) => (item.id || item._id) !== id));
			toast.success("Passenger deleted successfully");
		} catch (error) {
			toast.error(error?.message || "Something went wrong. Please try again.");
		} finally {
			setDeleteLoadingId(null);
		}
	};

	const handleUpdate = (id, currentName) => {
		setUpdateId(id);
		setUpdateName(currentName);
		setUpdateNameError("");
		setOpenUpdateModal(true);
	};

	const handleActualUpdate = async () => {
		if (!validateName(updateName)) {
			setUpdateNameError("Name must contain only letters, 3–50 characters, no numbers or symbols.");
			return;
		}
		try {
			setUpdateLoading(true);
			await updateUser(updateId, { name: updateName });
			setData((prev) =>
				prev.map((item) =>
					(item.id || item._id) === updateId ? { ...item, name: updateName } : item,
				),
			);
			setOpenUpdateModal(false);
			toast.success("Passenger updated successfully");
		} catch (error) {
			toast.error(error?.message || "Something went wrong. Please try again.");
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
	};

	const handleCloseUpdateModal = () => {
		setOpenUpdateModal(false);
	};

	return {
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
	};
};
