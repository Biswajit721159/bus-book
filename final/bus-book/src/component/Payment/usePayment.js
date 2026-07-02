import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { makePayment } from "../../apis/payment";

export const usePayment = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const userinfo = useSelector((state) => state.user);

	const {
		busId,
		src,
		dist,
		date,
		seat_record = [],
		person = [],
		total_money = 0,
		totalDistance = 0,
	} = location.state || {};

	const [activeTab, setActiveTab] = useState("card");
	const [submitload, setSubmitload] = useState(false);

	// Card state
	const [cardNumber, setCardNumber] = useState("1234232378676767");
	const [cardName, setCardName] = useState("Biswajit Ghosh");
	const [cardExpiry, setCardExpiry] = useState("12/45");
	const [cardCvv, setCardCvv] = useState("123");
	const [isCvvFocused, setIsCvvFocused] = useState(false);

	// UPI state
	const [upiId, setUpiId] = useState("");

	// Net Banking state
	const [selectedBank, setSelectedBank] = useState("");

	useEffect(() => {
		if (!location.state || !userinfo?.user) {
			toast.warn("Session expired or invalid booking details.");
			navigate("/");
		}
	}, [location.state, userinfo, navigate]);

	const handleCardNumberChange = (e) => {
		let value = e.target.value.replace(/\D/g, "");
		if (value.length > 16) value = value.slice(0, 16);
		const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
		setCardNumber(formatted);
	};

	const handleExpiryChange = (e) => {
		let value = e.target.value.replace(/\D/g, "");
		if (value.length > 4) value = value.slice(0, 4);
		if (value.length > 2) {
			value = value.slice(0, 2) + "/" + value.slice(2);
		}
		setCardExpiry(value);
	};

	const handleCvvChange = (e) => {
		const value = e.target.value.replace(/\D/g, "").slice(0, 3);
		setCardCvv(value);
	};

	const handlePaymentSubmit = async (e) => {
		e.preventDefault();

		if (activeTab === "card") {
			if (cardNumber.replace(/\s/g, "").length !== 16) {
				toast.error("Please enter a valid 16-digit card number.");
				return;
			}
			if (!cardName.trim()) {
				toast.error("Please enter the cardholder name.");
				return;
			}
			if (cardExpiry.length !== 5) {
				toast.error("Please enter a valid expiry date (MM/YY).");
				return;
			}
			if (cardCvv.length !== 3) {
				toast.error("Please enter a valid 3-digit CVV.");
				return;
			}
		} else if (activeTab === "upi") {
			if (!upiId.includes("@") || upiId.length < 5) {
				toast.error("Please enter a valid UPI ID (e.g. user@okhdfcbank).");
				return;
			}
		} else if (activeTab === "netbanking") {
			if (!selectedBank) {
				toast.error("Please select a bank to proceed.");
				return;
			}
		}

		setSubmitload(true);
		try {
			const body = {
				cardNumber: cardNumber.replace(/\s/g, ""),
				cardExpiryDate: cardExpiry,
				cardHolderName: cardName.trim(),
				cardCvv: cardCvv,
				totalAmount: total_money,
				busId: busId,
			};
			await makePayment(body);
			navigate(`/my-bookings`);
		} catch (error) {
			toast.error(error?.message || "Payment failed. Please try again.");
		} finally {
			setSubmitload(false);
		}
	};

	return {
		navigate,
		userinfo,
		busId,
		src,
		dist,
		date,
		seat_record,
		person,
		total_money,
		totalDistance,
		activeTab,
		setActiveTab,
		submitload,
		cardNumber,
		cardName,
		setCardName,
		cardExpiry,
		cardCvv,
		isCvvFocused,
		setIsCvvFocused,
		upiId,
		setUpiId,
		selectedBank,
		setSelectedBank,
		handleCardNumberChange,
		handleExpiryChange,
		handleCvvChange,
		handlePaymentSubmit,
	};
};

export default usePayment;
