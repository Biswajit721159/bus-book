import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import AppLayout from "../components/layout/AppLayout";

// Pages
import WelcomePage from "../pages/WelcomePage";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AddBus from "../pages/Buses/AddBus";
import EditBus from "../pages/Buses/EditBus";
import ViewBus from "../pages/Buses/ViewBus";
import Bookings from "../pages/Bookings";
// import Drivers from "../pages/Drivers";
import RoutesPage from "../pages/Routes";
import Settings from "../pages/Settings";

import ForgotPassword from "../pages/Login/ForgotPassword";
import ResetPassword from "../pages/Login/ResetPassword";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user } = useSelector((state: RootState) => state.userAuth);
	return user ? <AppLayout>{children}</AppLayout> : <Navigate to="/Login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user } = useSelector((state: RootState) => state.userAuth);
	return !user ? <>{children}</> : <Navigate to="/Dashboard" replace />;
};

const ErrorPage: React.FC = () => (
	<div className="page-container text-center py-20">
		<h1 className="text-4xl font-bold text-slate-800">404</h1>
		<p className="text-slate-500 mt-2 text-lg">Page not found</p>
		<button type="button" onClick={() => window.history.back()} className="btn-primary mt-6">
			Go Back
		</button>
	</div>
);

export const AppRoutes: React.FC = () => {
	return (
		<Routes>
			{/* Public Pages */}
			<Route path="/" element={<WelcomePage />} />
			<Route
				path="/Login"
				element={
					<PublicRoute>
						<Login />
					</PublicRoute>
				}
			/>
			<Route
				path="/Register"
				element={
					<PublicRoute>
						<Register />
					</PublicRoute>
				}
			/>
			<Route
				path="/ForgotPassword"
				element={
					<PublicRoute>
						<ForgotPassword />
					</PublicRoute>
				}
			/>
			<Route
				path="/ResetPassword"
				element={
					<PublicRoute>
						<ResetPassword />
					</PublicRoute>
				}
			/>

			{/* Private Dashboard & Admin Panels */}
			<Route
				path="/Dashboard"
				element={
					<PrivateRoute>
						<Dashboard />
					</PrivateRoute>
				}
			/>
			<Route
				path="/Dashboard/ManageUsers"
				element={
					<PrivateRoute>
						<Dashboard />
					</PrivateRoute>
				}
			/>

			{/* Private Bus Pages */}
			<Route
				path="/Buses/AddBus"
				element={
					<PrivateRoute>
						<AddBus />
					</PrivateRoute>
				}
			/>
			<Route
				path="/Buses/EditBus"
				element={
					<PrivateRoute>
						<EditBus />
					</PrivateRoute>
				}
			/>
			<Route
				path="/Buses/ViewBus/:_id"
				element={
					<PrivateRoute>
						<ViewBus />
					</PrivateRoute>
				}
			/>

			{/* Private Bookings */}
			<Route
				path="/Bookings"
				element={
					<PrivateRoute>
						<Bookings />
					</PrivateRoute>
				}
			/>

			{/* Private Drivers & Route Visualizers */}
			{/* <Route
				path="/Drivers"
				element={
					<PrivateRoute>
						<Drivers />
					</PrivateRoute>
				}
			/> */}
			<Route
				path="/Routes"
				element={
					<PrivateRoute>
						<RoutesPage />
					</PrivateRoute>
				}
			/>

			{/* Private Profile Settings */}
			<Route
				path="/Settings"
				element={
					<PrivateRoute>
						<Settings />
					</PrivateRoute>
				}
			/>

			{/* Fallback Error route */}
			<Route path="*" element={<ErrorPage />} />
		</Routes>
	);
};

export default AppRoutes;
