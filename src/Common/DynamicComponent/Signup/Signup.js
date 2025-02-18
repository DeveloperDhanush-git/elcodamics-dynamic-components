import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const navigate = useNavigate();

  // Validate each input field
  const handleChange = ({ currentTarget: input }) => {
    if (input.name === "username") {
      // Check if the username contains any number
      if (/\d/.test(input.value)) {
        setUsernameError("Username cannot contain numbers");
      } else {
        setUsernameError(""); // Clear error if no numbers
      }
    }

    if (input.name === "phone" && !/^\d+$/.test(input.value)) {
      setError("Phone number can only contain numbers");
    } else {
      setError(""); // Clear error if phone is valid
    }

    if (input.name === "password") {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(input.value)) {
        setPasswordError(
          "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and a special character."
        );
      } else {
        setPasswordError(""); // Clear password error if valid
      }
    }

    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError || usernameError) {
      return; // Prevent form submission if there are errors
    }
    try {
      const url = "http://localhost/signup.php"; // Correct URL
      const { data: res } = await axios.post(url, data);

      if (res.status === "success") {
        navigate("/login");
      } else {
        setError(res.message);
      }
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[900px] h-[500px] flex rounded-lg shadow-xl">
        <div className="flex-1 flex flex-col items-center justify-center bg-teal-400 rounded-l-lg">
          <h1 className="text-white text-4xl">Welcome Back</h1>
          <Link to="/login">
            <button type="button" className="w-[180px] py-3 bg-white text-teal-400 font-bold text-sm rounded-full mt-4">
              Log In
            </button>
          </Link>
        </div>
        <div className="flex-2 flex flex-col items-center justify-center bg-white rounded-r-lg">
          <form className="flex flex-col items-center" onSubmit={handleSubmit}>
            <h1 className="text-4xl mt-0">Create Account</h1>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              value={data.username}
              required
              className="w-[370px] p-4 rounded-lg bg-gray-100 my-2 text-sm"
            />
            {usernameError && (
              <div className="w-[370px] p-4 my-2 text-sm bg-red-500 text-white rounded-lg text-center">
                {usernameError}
              </div>
            )}
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className="w-[370px] p-4 rounded-lg bg-gray-100 my-2 text-sm"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              name="phone"
              onChange={handleChange}
              value={data.phone}
              required
              className="w-[370px] p-4 rounded-lg bg-gray-100 my-2 text-sm"
            />
            {error && (
              <div className="w-[370px] p-4 my-2 text-sm bg-red-500 text-white rounded-lg text-center">
                {error}
              </div>
            )}
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className="w-[370px] p-4 rounded-lg bg-gray-100 my-2 text-sm"
            />
            {passwordError && (
              <div className="w-[370px] p-4 my-2 text-sm bg-red-500 text-white rounded-lg text-center">
                {passwordError}
              </div>
            )}
            <button
              type="submit"
              className="w-[180px] py-3 bg-teal-400 text-white font-bold text-sm rounded-full mt-4"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
