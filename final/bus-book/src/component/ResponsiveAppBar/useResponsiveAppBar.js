import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { usermethod } from "../../redux/UserSlice";

export const useResponsiveAppBar = () => {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const [mobileOpen, setMobileOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const profileRef = useRef(null);

	// Close menus on route change
	useEffect(() => {
		setMobileOpen(false);
		setProfileOpen(false);
	}, [location.pathname]);

	// Handle clicks outside profile dropdown
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (profileRef.current && !profileRef.current.contains(e.target)) {
				setProfileOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Handle scroll effects for dynamic navbar appearance
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 15) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleLogout = () => {
		dispatch(usermethod.Logout_User());
		setProfileOpen(false);
		setMobileOpen(false);
		navigate("/");
	};

	const rawName = user?.user?.name || user?.name || "";
	const initials = rawName
		? rawName
				.split(" ")
				.filter(Boolean)
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: "U";

	const firstName = rawName ? rawName.split(" ")[0] : "User";
	const userEmail = user?.user?.email || user?.email || "";

	const closeMobile = () => setMobileOpen(false);
	const toggleMobile = () => setMobileOpen((prev) => !prev);
	const toggleProfile = () => setProfileOpen((prev) => !prev);

	return {
		user,
		mobileOpen,
		profileOpen,
		profileRef,
		initials,
		firstName,
		userEmail,
		scrolled,
		handleLogout,
		closeMobile,
		toggleMobile,
		toggleProfile,
		setProfileOpen,
	};
};

export default useResponsiveAppBar;
