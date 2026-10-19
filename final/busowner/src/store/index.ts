import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
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

setupListeners(store.dispatch);

export const invalidateBusCache = () => {
  store.dispatch(busApiSlice.util.invalidateTags(['Bus']));
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
