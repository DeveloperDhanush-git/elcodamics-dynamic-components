import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(data.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const url = "http://localhost/login.php"; // Correct PHP endpoint for login
      const response = await axios.post(url, data);

      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token); // Save the token
        window.location = "/"; // Redirect to home or dashboard after successful login
      } else {
        setError(response.data.message); // Display error message
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="w-[900px] h-[500px] flex shadow-lg rounded-lg overflow-hidden">
        {/* Left Side */}
        <div className="flex-2 flex flex-col items-center justify-center bg-white p-8">
          <form className="flex flex-col items-center" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-bold mb-4">Login to Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className="w-[370px] p-3 rounded-md bg-gray-100 mb-3 text-sm outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className="w-[370px] p-3 rounded-md bg-gray-100 mb-3 text-sm outline-none"
            />
            {error && (
              <div className="w-[370px] p-3 text-sm bg-red-500 text-white rounded-md text-center">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="bg-teal-500 text-white w-[180px] py-2 rounded-full font-bold text-sm mt-4"
            >
              Log In
            </button>
          </form>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex flex-col items-center justify-center bg-teal-500 p-8">
          <h1 className="text-3xl text-white font-bold mb-4">New Here?</h1>
          <Link to="/signup">
            <button className="bg-white text-teal-500 w-[180px] py-2 rounded-full font-bold text-sm">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
