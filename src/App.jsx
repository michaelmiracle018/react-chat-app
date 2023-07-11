import React from "react";
import "./App.css";
import PrivateRoutes from "./components/PrivateRoutes";

import Room from "./pages/Room";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const App = () => {
	return (
		<div>
			<Router>
				<AuthProvider>
					<Routes>
						<Route path="/login" element={<LoginPage />}></Route>
						<Route path="/register" element={<RegisterPage />}></Route>

						<Route element={<PrivateRoutes />}>
							<Route path="/" element={<Room />}></Route>
						</Route>
					</Routes>
				</AuthProvider>
			</Router>

			<ToastContainer />
		</div>
	);
};

export default App;
