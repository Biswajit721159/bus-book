import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import busReducer, { busApiSlice } from './slices/busSlice';
import bookingReducer, { bookingApiSlice } from './slices/bookingSlice';
import { userApiSlice } from './slices/userApiSlice';

const store = configureStore({
  reducer: {
    userAuth: authReducer,
    booking: bookingReducer,
    [bookingApiSlice.reducerPath]: bookingApiSlice.reducer,
    busDetails: busReducer,
    [busApiSlice.reducerPath]: busApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      bookingApiSlice.middleware,
      busApiSlice.middleware,
      userApiSlice.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
