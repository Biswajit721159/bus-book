import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../redux/UserSlice'
import BusSearchReducer from "./BusSearchSlice";
import BusReducer from "./BusSlice"
export default configureStore({

    reducer: {
        user: userReducer,
        BusSearch:BusSearchReducer,
        Bus:BusReducer
    },


});