import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../apis/axiosInstance";

export const loadStation = createAsyncThunk("busTable/loadStation", async () => {
	try {
		const response = await axiosInstance.get(`/api/stations/get-all`);
		return response.data.data;
	} catch (error) {
		throw error;
	}
});

export const loadBus = createAsyncThunk("busTable/loadBus", async () => {
	try {
		const response = await axiosInstance.get(`/api/buses/top-rated`);
		return response.data.data;
	} catch (error) {
		throw error;
	}
});

export const fetchBusData = createAsyncThunk("busTable/fetchBusData", async (body) => {
	try {
		const response = await axiosInstance.post(`/api/buses/search`, body);
		return response?.data.data || [];
	} catch (error) {
		throw error;
	}
});

const initialState = {
	topRatedBuses: [],
	topRatedLoaded: false,
	loadingTopRated: false,
	mainBus: [],
	Bus: [],
	station: [],
	loadingBus: false,
	loadingStation: false,
	stationLoaded: false,
	busLoaded: false,
	error: null,
	searchinput: "Riktam",
};

// Safe helper parsing
function parseTimeMinutes(timeStr) {
	if (!timeStr || typeof timeStr !== "string") return 0;
	const parts = timeStr.trim().split(":");
	if (parts.length >= 2) {
		const hh = parseInt(parts[0], 10) || 0;
		const mm = parseInt(parts[1], 10) || 0;
		return hh * 60 + mm;
	}
	return 0;
}

function parseDurationMinutes(durationStr) {
	if (!durationStr || typeof durationStr !== "string") return 0;
	const hoursMatch = durationStr.match(/(\d+)\s*h/i);
	const minsMatch = durationStr.match(/(\d+)\s*m/i);
	const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
	const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
	return hours * 60 + mins;
}

const getDepartureMinutes = (bus) => {
	// Source station departure time
	const time = bus?.arrivalTime || bus?.start_time || bus?.departureTime;
	return parseTimeMinutes(time);
};

const getArrivalMinutes = (bus) => {
	// Destination station arrival time
	const time = bus?.departureTime || bus?.end_arrive_time || bus?.arrivalTime;
	return parseTimeMinutes(time);
};

const getPrice = (bus) => {
	if (typeof bus?.price === "number") return bus.price;
	return (bus?.totalDistance || 0) * 5;
};

const getRating = (bus) => {
	return Number(bus?.averageRating) || 0;
};

function searchproduct(searchinput, bus) {
	if (!searchinput || searchinput.length === 0) {
		return bus || [];
	} else {
		const q = searchinput.toLowerCase().trim();
		return (bus || []).filter((b) => b?.busName && b.busName.toLowerCase().includes(q));
	}
}

const busTableSlice = createSlice({
	name: "busTable",
	initialState,
	reducers: {
		Addsearch: (state, action) => {
			state.searchinput = action?.payload?.searchinput;
			state.Bus = searchproduct(action?.payload?.searchinput, action?.payload?.bus || state.mainBus);
		},
		DurationEarlyFirst: (state, action) => {
			const list = action?.payload && action.payload.length > 0 ? action.payload : state.Bus;
			state.Bus = [...list].sort(
				(a, b) => parseDurationMinutes(a?.totalTime) - parseDurationMinutes(b?.totalTime)
			);
		},
		DurationLateFirst: (state, action) => {
			const list = action?.payload && action.payload.length > 0 ? action.payload : state.Bus;
			state.Bus = [...list].sort(
				(a, b) => parseDurationMinutes(b?.totalTime) - parseDurationMinutes(a?.totalTime)
			);
		},
		DepartureEarlyFirst: (state, action) => {
			const list = action?.payload && action.payload.length > 0 ? action.payload : state.Bus;
			state.Bus = [...list].sort((a, b) => getDepartureMinutes(a) - getDepartureMinutes(b));
		},
		DepartureLateFirst: (state, action) => {
			const list = action?.payload && action.payload.length > 0 ? action.payload : state.Bus;
			state.Bus = [...list].sort((a, b) => getDepartureMinutes(b) - getDepartureMinutes(a));
		},
		ArrivalEarlyFirst: (state, action) => {
			const list = action?.payload && action.payload.length > 0 ? action.payload : state.Bus;
			state.Bus = [...list].sort((a, b) => getArrivalMinutes(a) - getArrivalMinutes(b));
		},
		ArrivalLateFirst: (state, action) => {
			const list = action?.payload && action.payload.length > 0 ? action.payload : state.Bus;
			state.Bus = [...list].sort((a, b) => getArrivalMinutes(b) - getArrivalMinutes(a));
		},
		PriceLowFirst: (state, action) => {
			const list = action?.payload && action.payload.length > 0 ? action.payload : state.Bus;
			state.Bus = [...list].sort((a, b) => getPrice(a) - getPrice(b));
		},
		PriceHighFirst: (state, action) => {
			const list = action?.payload && action.payload.length > 0 ? action.payload : state.Bus;
			state.Bus = [...list].sort((a, b) => getPrice(b) - getPrice(a));
		},
		RatingHighFirst: (state, action) => {
			const list = action?.payload && action.payload.length > 0 ? action.payload : state.Bus;
			state.Bus = [...list].sort((a, b) => getRating(b) - getRating(a));
		},
		ResetFilter: (state) => {
			if (state.mainBus && state.mainBus.length > 0) {
				state.Bus = [...state.mainBus];
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadStation.pending, (state) => {
				state.loadingStation = true;
				state.error = null;
			})
			.addCase(loadStation.fulfilled, (state, action) => {
				state.loadingStation = false;
				state.stationLoaded = true;
				state.station = action.payload || [];
			})
			.addCase(loadStation.rejected, (state, action) => {
				state.loadingStation = false;
				state.stationLoaded = true;
				state.error = action.error.message;
			})
			.addCase(loadBus.pending, (state) => {
				state.loadingTopRated = true;
				state.loadingBus = true;
				state.error = null;
			})
			.addCase(loadBus.fulfilled, (state, action) => {
				state.loadingTopRated = false;
				state.topRatedLoaded = true;
				state.topRatedBuses = action.payload || [];
				state.loadingBus = false;
				state.busLoaded = true;
				state.mainBus = action.payload || [];
				state.Bus = action.payload || [];
			})
			.addCase(loadBus.rejected, (state, action) => {
				state.loadingTopRated = false;
				state.topRatedLoaded = true;
				state.loadingBus = false;
				state.busLoaded = true;
				state.error = action.error.message;
			})
			.addCase(fetchBusData.pending, (state) => {
				state.loadingBus = true;
				state.loadingStation = true;
				state.error = null;
			})
			.addCase(fetchBusData.fulfilled, (state, action) => {
				state.loadingBus = false;
				state.loadingStation = false;
				state.busLoaded = true;
				state.mainBus = action.payload || [];
				state.Bus = action.payload || [];
			})
			.addCase(fetchBusData.rejected, (state, action) => {
				state.loadingBus = false;
				state.loadingStation = false;
				state.busLoaded = true;
				state.error = action?.payload?.errorMessage;
			});
	},
});

export const BusTablemethod = busTableSlice.actions;
export default busTableSlice.reducer;
