import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
	const navigate = useNavigate();
	const { user, handleUserLogin, loadUser } = useAuth();

	const [credentials, setCredentials] = useState({
		email: "",
		password: "",
	});

	const handleInputChange = (e) => {
		let name = e.target.name;
		let value = e.target.value;
		setCredentials({ ...credentials, [name]: value });
	};

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, []);

	return (
		<>
			<div className="auth--container">
				<div className="form--wrapper">
					<form
						onSubmit={(e) => {
							handleUserLogin(e, credentials);
						}}
					>
						<div className="field--wrapper">
							<label>Email</label>
							<input
								required
								type="email"
								name="email"
								placeholder="Enter your email..."
								value={credentials.email}
								onChange={(e) => {
									handleInputChange(e);
								}}
							/>
						</div>
						<div className="field--wrapper">
							<label>Password</label>
							<input
								required
								type="password"
								name="password"
								placeholder="Enter password..."
								value={credentials.password}
								onChange={(e) => {
									handleInputChange(e);
								}}
							/>
						</div>
						<div className="field--wrapper">
							{loadUser ? (
								<div className="btn btn--lg btn--main center__div">
									<div className="loader__user"></div>
								</div>
							) : (
								<input
									type="submit"
									value="Login"
									className="btn btn--lg btn--main"
								/>
							)}
						</div>
					</form>
					<p>
						Don't have an account? Register <Link to="/register">here</Link>
					</p>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
