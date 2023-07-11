import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const [loadUser, setLoadUser] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	useEffect(() => {
		getUserOnLoad();
	}, []);

	const getUserOnLoad = async () => {
		try {
			const accountDetails = await account.get();
			setUser(accountDetails);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};

	const handleUserLogin = async (e, credentials) => {
		e.preventDefault();
		setLoadUser(true);
		try {
			const response = await account.createEmailSession(
				credentials.email,
				credentials.password,
			);
			setLoadUser(false);
			// console.log("logged In:", response);
			const accountDetails = await account.get();
			setUser(accountDetails);
			navigate("/");
		} catch (error) {
			setLoadUser(false);
			// console.log(error?.response?.code);
			if (error?.response?.code === 404) {
				toast.success("Please Register Your Account", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				setErrorMsg("");
				// alert("Please Register Your Account");
				console.log(errorMsg);
				navigate("/login");
			}
			if (error?.response?.code === 401) {
				toast.error("Invalid credentials.Please check the email or password.", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});

				navigate("/login");
			}

			if (error?.response?.code === 400) {
				toast.error("Password must be at least 8 characters", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});

				navigate("/login");
			}
		}
	};

	const handleUserLogOut = async () => {
		await account.deleteSession("current");
		setUser(null);
	};

	const handleUserRegister = async (e, credentials) => {
		e.preventDefault();
		console.log("Handle Register triggered!", credentials);

		if (credentials.password1 !== credentials.password2) {
			alert("Passwords did not match!");
			return;
		}
		setLoadUser(true);
		try {
			let response = await account.create(
				ID.unique(),
				credentials.email,
				credentials.password1,
				credentials.name,
			);
			// console.log("User registered!", response);
			setLoadUser(false);

			await account.createEmailSession(
				credentials.email,
				credentials.password1,
			);
			let accountDetails = await account.get();
			setUser(accountDetails);
			navigate("/");
		} catch (error) {
			console.error(error);

			if (error?.response?.code === 409) {
				toast.success(
					"A user with the same email already exists. Login Instead",
					{
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "colored",
					},
				);
				navigate("/login");
				window.location.reload(false);
			}
		}
	};

	const contextData = {
		user,
		handleUserLogin,
		handleUserLogOut,
		handleUserRegister,
		loadUser,
	};

	return (
		<AuthContext.Provider value={contextData}>
			{loading ? <Loading /> : children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};

export default AuthContext;
