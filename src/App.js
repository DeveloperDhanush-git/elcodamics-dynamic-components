import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Main from "./Common/DynamicComponent/Main/Main";
import Signup from "./Common/DynamicComponent/Signup/Signup";
import Login from "./Common/DynamicComponent/Login/Login";

function App() {
	const user = localStorage.getItem("token");

	return (
		<BrowserRouter>
			<Routes>
				{user && <Route path="/" exact element={<Main />} />}
				<Route path="/signup" exact element={<Signup />} />
				<Route path="/login" exact element={<Login />} />
				<Route path="/" element={<Navigate replace to="/login" />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
