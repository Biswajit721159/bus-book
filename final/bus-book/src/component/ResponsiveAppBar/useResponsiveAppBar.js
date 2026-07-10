import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { usermethod } from "../../redux/UserSlice";

export const useResponsiveAppBar = () => {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);
	const profileRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (profileRef.current && !profileRef.current.contains(e.target)) {
				setProfileOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = () => {
		dispatch(usermethod.Logout_User());
		setProfileOpen(false);
		navigate("/");
	};

	const initials = user?.user?.name
		? user.user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: "U";

	const closeMobile = () => setMobileOpen(false);
	const toggleMobile = () => setMobileOpen((prev) => !prev);
	const toggleProfile = () => setProfileOpen((prev) => !prev);

	const firstName = user?.user?.name ? user.user.name.split(" ")[0] : "";

	return {
		user,
		mobileOpen,
		profileOpen,
		profileRef,
		initials,
		firstName,
		handleLogout,
		closeMobile,
		toggleMobile,
		toggleProfile,
		setProfileOpen,
	};
};

export default useResponsiveAppBar;
