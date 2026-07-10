import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResponsiveAppBar from "./component/ResponsiveAppBar";
import Loader from "./component/Loader";
import ErrorBoundary from "./component/ErrorBoundary";
import ProtectedRoute from "./component/ProtectedRoute";
import GuestRoute from "./component/GuestRoute";

// Lazy load routing components
const FrontPage = React.lazy(() => import("./component/FrontPage"));
const Home = React.lazy(() => import("./component/Home"));
const Register = React.lazy(() => import("./component/Auth/Register"));
const Login = React.lazy(() => import("./component/Auth/Login"));
const MasterList = React.lazy(() => import("./component/MasterList"));
const LastTransaction = React.lazy(() => import("./component/LastTransaction"));
const WishList = React.lazy(() => import("./component/WishList"));
const CheckStatus = React.lazy(() => import("./component/CheckStatus"));
const TicketBook = React.lazy(() => import("./component/TicketBook"));
const ForgotPassword = React.lazy(() => import("./component/Auth/ForgotPassword"));
const ViewTicket = React.lazy(() => import("./component/ViewTicket"));
const ViewBus = React.lazy(() => import("./component/ViewBus"));
const Payment = React.lazy(() => import("./component/Payment"));
const Error = React.lazy(() => import("./component/Error"));

function App() {
	return (
		<ErrorBoundary>
			<div>
				<Router>
					<ResponsiveAppBar />
					<Suspense fallback={<Loader text="Loading..." />}>
						<Routes>
							{/* Public Routes */}
							<Route path="/" element={<FrontPage />} />
							<Route path="/book-bus" element={<Home />} />
							<Route path="/check-status" element={<CheckStatus />} />
							<Route path="/view-bus/:_id" element={<ViewBus />} />

							{/* Guest Only Routes */}
							<Route
								path="/register"
								element={
									<GuestRoute>
										<Register />
									</GuestRoute>
								}
							/>
							<Route
								path="/login"
								element={
									<GuestRoute>
										<Login />
									</GuestRoute>
								}
							/>
							<Route
								path="/forgot-password"
								element={
									<GuestRoute>
										<ForgotPassword />
									</GuestRoute>
								}
							/>

							{/* Protected Routes */}
							<Route
								path="/master-list"
								element={
									<ProtectedRoute>
										<MasterList />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/my-bookings"
								element={
									<ProtectedRoute>
										<LastTransaction />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/wish-list"
								element={
									<ProtectedRoute>
										<WishList />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/book-ticket/:busId/:src/:dist/:date"
								element={
									<ProtectedRoute>
										<TicketBook />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/payment"
								element={
									<ProtectedRoute>
										<Payment />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/view-ticket/:_id"
								element={
									<ProtectedRoute>
										<ViewTicket />
									</ProtectedRoute>
								}
							/>

							{/* Fallback 404 Route */}
							<Route path="*" element={<Error />} />
						</Routes>
					</Suspense>
				</Router>
				<ToastContainer
					position="top-right"
					autoClose={2000}
					hideProgressBar={true}
					closeOnClick
					theme="light"
				/>
			</div>
		</ErrorBoundary>
	);
}

export default App;

