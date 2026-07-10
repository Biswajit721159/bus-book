import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getSeatRecord, lockSeatRecord } from "../../apis/seat";
import { getAllUsers } from "../../apis/passengers";
import SeatMap from "./SeatMap";
import JourneyDetails from "./JourneyDetails";
import PassengerModal from "./PassengerModal";

const TicketBook = () => {
	const userinfo = useSelector((state) => state.user);
	const history = useNavigate();
	const { src, dist, date, busId } = useParams();

	const [load, setLoad] = useState(true);
	const [data, setData] = useState([]);
	const [seatarr, setSeatarr] = useState([]);
	const [MasterList, setMasterList] = useState([]);
	const [checkbox, setCheckbox] = useState([]);
	const [pay, setPay] = useState(0);
	const [totalDistance, setTotalDistance] = useState(0);
	const [modalOpen, setModalOpen] = useState(false);
	const [isSeatLocking, setIsSeatLocking] = useState(false);

	const markseat = (id) => {
		if (data[id - 1].isBooked === "Both") {
			const newArr = seatarr.filter((s) => s !== id);
			setSeatarr(newArr);
			return true;
		} else {
			if (seatarr.length >= 5) return false;
			if (seatarr.length >= MasterList.length) return false;
			setSeatarr([...seatarr, id]);
			return true;
		}
	};

	const Mark = (id) => {
		if (markseat(id)) {
			const idx = id - 1;
			const newData = [...data];
			newData[idx] = { ...newData[idx], isBooked: newData[idx].isBooked === false ? "Both" : false };
			setData(newData);
		} else {
			if (seatarr.length >= MasterList.length) {
				toast.warn(`Your MasterList has ${MasterList.length} passenger(s)`);
			} else {
				toast.warn("Sorry, maximum 5 seats are allowed!");
			}
		}
	};

	const show_seat = async () => {
		try {
			setLoad(true);
			const seatRes = await getSeatRecord({
				source: src,
				dist: dist,
				bookingDate: date,
				busId: busId,
			});
			const masterListRes = await getAllUsers();
			setMasterList(masterListRes.data);
			setData(seatRes.data.seats);
			setTotalDistance(seatRes.data.totalDistance);
		} catch (error) {
			toast.error(error?.message || "Something went wrong");
			history("*");
		} finally {
			setLoad(false);
		}
	};

	const handleCheckboxChange = (name) => {
		if (checkbox.includes(name)) {
			setCheckbox(checkbox.filter((c) => c !== name));
			setPay((p) => p - totalDistance * 5);
		} else if (checkbox.length >= seatarr.length) {
			toast.warn(`You selected ${seatarr.length} seat(s). Please select exactly that many passengers.`);
		} else {
			setCheckbox([...checkbox, name]);
			setPay((p) => p + totalDistance * 5);
		}
	};

	const checkAlreadyBoth = () => {
		for (let i = 0; i < seatarr.length; i++) {
			if (data[seatarr[i] - 1].isBooked !== "Both") return false;
		}
		return true;
	};

	const goToPayment = async () => {
		try {
			const body = {
				busId: busId,
				source: src,
				dist: dist,
				bookingDate: date,
				passengerIds: checkbox,
				seatIds: seatarr,
			};
			setIsSeatLocking(true);

			const lockRes = await lockSeatRecord(body);
			console.log(lockRes);

			const trimmedSeatarr = seatarr.slice(0, checkbox.length);
			if (checkAlreadyBoth() && checkbox.length === trimmedSeatarr.length) {
				const selectedNames = checkbox.map((id) => {
					const passenger = MasterList.find((item) => String(item.id || item._id) === String(id));
					return passenger ? passenger.name : `Passenger ${id}`;
				});

				history("/payment", {
					state: {
						busId,
						src,
						dist,
						date,
						seat_record: trimmedSeatarr,
						person: selectedNames,
						total_money: pay,
						totalDistance,
					},
				});
			}
		} catch (error) {
			toast.warn(error?.message || "Something went wrong");
		} finally {
			setIsSeatLocking(false);
		}
	};

	useEffect(() => {
		show_seat();
	}, [userinfo]);

	if (load) return <Loader text="Loading seat map..." />;

	return (
		<div className="min-h-[calc(100vh-64px)] bg-surface-50">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-surface-900">Select Your Seats</h1>
					<p className="text-surface-500 text-sm mt-1">
						{src} → {dist} &nbsp;·&nbsp; {date}
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Seat Map */}
					<div className="lg:col-span-2">
						<SeatMap
							data={data}
							seatarr={seatarr}
							Mark={Mark}
							onContinue={() => setModalOpen(true)}
						/>
					</div>

					{/* Info Panel */}
					<div>
						<JourneyDetails
							src={src}
							dist={dist}
							date={date}
							totalDistance={totalDistance}
							MasterList={MasterList}
						/>
					</div>
				</div>
			</div>

			{/* Passenger Selection Modal */}
			<PassengerModal
				modalOpen={modalOpen}
				setModalOpen={setModalOpen}
				MasterList={MasterList}
				checkbox={checkbox}
				handleCheckboxChange={handleCheckboxChange}
				seatarr={seatarr}
				pay={pay}
				goToPayment={goToPayment}
				isSeatLocking={isSeatLocking}
			/>
		</div>
	);
};

export default TicketBook;
