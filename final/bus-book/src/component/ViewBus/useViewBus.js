import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getBusById } from "../../apis/bus";

export const useViewBus = () => {
	const [data, setData] = useState();
	const [load, setLoad] = useState(true);
	const { _id } = useParams();

	const loadBus = async () => {
		try {
			setLoad(true);
			const res = await getBusById(_id);
			setData(res.data);
		} catch (error) {
			toast.warn(error?.message || "Failed to load bus details");
		} finally {
			setLoad(false);
		}
	};

	useEffect(() => {
		if (_id) {
			loadBus();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [_id]);

	return {
		data,
		load,
	};
};
