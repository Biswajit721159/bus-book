/**
 * Central API endpoint registry.
 * All backend endpoint paths are defined here — never hardcoded elsewhere.
 */

export const API_ENDPOINTS = {
	// ─── Auth ─────────────────────────────────────────────────────────────
	AUTH: {
		REGISTER: "bus-owner/register",
		REGISTER_VERIFY_OTP: "bus-owner/register/verify-otp",
		LOGIN: "bus-owner/login",
		LOGIN_VERIFY_OTP: "bus-owner/login/verify-otp",
		RESEND_OTP: "bus-owner/resent-otp",
		FORGOT_PASSWORD: "bus-owner/forgot-password",
		RESET_PASSWORD: "bus-owner/reset-password",
		GOOGLE_LOGIN: "bus-owner/google-login",
		LOGIN_BY_TOKEN: "Adminpanel/logInByToken",
	},

	// ─── User Profile ─────────────────────────────────────────────────────
	USER: {
		UPDATE_PROFILE: "user/updateUser",
		GET_BY_PAGE: "user/getUserByPage",
	},

	// ─── Buses ────────────────────────────────────────────────────────────
	BUS: {
		LIST: "buses",
		BY_ID: (id: string) => `buses/${id}`,
		FILTER: "buses/filter",
		CREATE: "buses",
		UPDATE: (id: string) => `buses/${id}`,
	},

	// ─── Bookings ─────────────────────────────────────────────────────────
	BOOKING: {
		PAGINATION: "booking/pagination",
		STATUS: (pageNo: string) => `booking/getTicket/${pageNo}`,
	},

	// ─── Drivers ──────────────────────────────────────────────────────────
	DRIVER: {
		LIST: "drivers",
		CREATE: "drivers",
		UPDATE: (id: string) => `drivers/${id}`,
		DELETE: (id: string) => `drivers/${id}`,
	},
} as const;
