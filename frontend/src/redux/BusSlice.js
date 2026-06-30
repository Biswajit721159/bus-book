import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const api = process.env.REACT_APP_API;


export const loadStation = createAsyncThunk(
    'busTable/loadStation',
    async () => {
        try {
            const response = await fetch(`${api}/bus/get_station`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            throw error;
        }
    }
);

export const loadBus = createAsyncThunk(
    'busTable/loadBus',
    async () => {
        try {
            const response = await fetch(`${api}/bus/getFirstTenBus/`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            throw error;
        }
    }
);


export const fetchBusData = createAsyncThunk(
    'busTable/fetchBusData',
    async (station) => {
        try {
            const response = await fetch(`${api}/bus/get_bus`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    start_station: station.src,
                    end_station: station.dist
                })
            });
            const data = await response.json();
            return data.data
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
);


const initialState = {
    mainBus: [],
    Bus: [],
    station: [],
    loadingBus: false,
    loadingStation: false,
    error: null,
    searchinput: 'Riktam',
};

function searchproduct(searchinput, bus) {
    if (searchinput.length === 0) {
        return bus
    }
    else {
        searchinput = searchinput.toLowerCase();
        let n = searchinput.length;
        let newbus = [];
        for (let i = 0; i < bus.length; i++) {
            let s = bus[i].bus_name;
            s = s.toLowerCase();
            if (KMP(searchinput, s) === true || check_All_Charcter(searchinput, s)) {
                newbus.push(bus[i]);
            }
        }
        return newbus
    }
}

function KMP(searchproduct, product_name) {
    let patt = solve1(searchproduct);
    let original = solve2(product_name);
    let n = patt.length;
    for (let i = 0; i < original.length - n + 1; i++) {
        let generate = original.substring(i, i + n);
        if (generate === patt) return true;
    }
    return false;
}

function check_All_Charcter(searchproduct, product_name) {
    let s = product_name;
    let patt = searchproduct;
    let i = 0;
    let j = 0;
    let n = s.length;
    let m = patt.length;
    while (i < n && j < m) {
        if (patt[j] == s[i]) {
            i++; j++;
        }
        else {
            i++;
        }
    }
    if (j == m) {
        return true;
    }
    return false;
}

function solve1(s) {
    let res = "";
    for (let i = 0; i < s.length; i++) {
        if (s[i] >= 'a' && s[i] < 'z') {
            res += s[i];
        }
    }
    return res;
}

function solve2(s) {
    let res = "";
    for (let i = 0; i < s.length; i++) {
        if (s[i] >= 'a' && s[i] < 'z') {
            res += s[i];
        }
    }
    return res;
}

const busTableSlice = createSlice({
    name: 'busTable',
    initialState,
    reducers: {
        Addsearch: (state, action) => {
            state.searchinput = action?.payload?.searchinput
            state.Bus = searchproduct(action?.payload?.searchinput, action?.payload?.bus)
        },
        DurationEarlyFirst: (state, action) => {
            let bus = action?.payload;
            let sortedBuses = [...bus].sort((a, b) => {
                let fa = HourToMin(a?.total_time);
                let fb = HourToMin(b?.total_time);

                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            });
            state.Bus = sortedBuses;
        },
        DurationLateFirst: (state, action) => {
            let bus = action?.payload;
            let sortedBuses = [...bus]?.sort((a, b) => {
                let fa = HourToMin(a?.total_time)
                let fb = HourToMin(b?.total_time)

                if (fa > fb) {
                    return -1;
                }
                if (fa < fb) {
                    return 1;
                }
                return 0;
            });
            state.Bus = sortedBuses
        },
        DepartureEarlyFirst: (state, action) => {
            let bus = action?.payload;
            let sortedBuses = [...bus]?.sort((a, b) => {
                let fa = finMinutes(a?.end_arrive_time)
                let fb = finMinutes(b?.end_arrive_time)

                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            });
            state.Bus = sortedBuses
        },
        DepartureLateFirst: (state, action) => {
            let bus = action?.payload;
            let sortedBuses = [...bus]?.sort((a, b) => {
                let fa = finMinutes(a?.end_arrive_time)
                let fb = finMinutes(b?.end_arrive_time)

                if (fa > fb) {
                    return -1;
                }
                if (fa < fb) {
                    return 1;
                }
                return 0;
            });
            state.Bus = sortedBuses
        },
        ArrivalEarlyFirst: (state, action) => {
            let bus = action?.payload;
            let sortedBuses = [...bus]?.sort((a, b) => {
                let fa = finMinutes(a?.start_arrived_time)
                let fb = finMinutes(b?.start_arrived_time)

                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            });
            state.Bus = sortedBuses
        },
        ArrivalLateFirst: (state, action) => {
            let bus = action?.payload;
            let sortedBuses = [...bus]?.sort((a, b) => {
                let fa = finMinutes(a?.start_arrived_time)
                let fb = finMinutes(b?.start_arrived_time)

                if (fa > fb) {
                    return -1;
                }
                if (fa < fb) {
                    return 1;
                }
                return 0;
            });
            state.Bus = sortedBuses
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadStation.pending, (state) => {
                state.loadingStation = true;
                state.error = null;
            })
            .addCase(loadStation.fulfilled, (state, action) => {
                state.loadingStation = false;
                state.station = action.payload;
            })
            .addCase(loadStation.rejected, (state, action) => {
                state.loadingStation = false;
                state.error = action.error.message;
            })
            .addCase(loadBus.pending, (state) => {
                state.loadingBus = true;
                state.error = null;
            })
            .addCase(loadBus.fulfilled, (state, action) => {
                state.loadingBus = false;
                state.Bus = action.payload;
            })
            .addCase(loadBus.rejected, (state, action) => {
                state.loadingBus = false;
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
                state.Bus = action.payload;
            })
            .addCase(fetchBusData.rejected, (state, action) => {
                state.loadingBus = false;
                state.loadingStation = false;
                state.error = action?.payload?.errorMessage;
            });;

    }
});

function HourToMin(s) {
    let count = 0;
    let ans = 0;
    let i = 0;
    let n = s.length
    while (i < n && s[i] != 'h') {
        count = count * 10 + (s[i] - '0');
        i++;
    }
    ans += (count * 60);
    i += 2;
    count = 0;
    while (i < n && s[i] != 'm') {
        count = count * 10 + (s[i] - '0');
        i++;
    }
    ans += count;
    return ans;
}

function finMinutes(s) {
    let hh = s.substr(0, 2);
    let mm = s.substr(3, 2);

    hh = parseInt(hh);
    mm = parseInt(mm);
    return (hh * 60 + mm)
}

export const BusTablemethod = busTableSlice.actions;
export default busTableSlice.reducer;

