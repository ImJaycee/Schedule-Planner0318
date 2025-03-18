import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import a2kLogo from "../assets/a2klogo.png";  // Top-left logo
import flexiSchedLogo from "../assets/logo.png";  // Centered above form
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { user, loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      localStorage.setItem("accessToken", res.data.accessToken); // Save token
      localStorage.setItem('userId', res.data.user._id); // Store user ID in local storage
      navigate("/homepage");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid credentials";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      setEmail("");
      setPassword("");
    }
  };

  useEffect(() => {
    console.log(user);
  }, [user]); // Logs user only when it changes

  return (
    <div className="flex min-h-screen bg-white relative">
      <img src={a2kLogo} alt="A2K Logo" className="absolute top-6 left-8 w-32" />
      <div className="flex flex-col items-center justify-center w-full">
        <img src={flexiSchedLogo} alt="FlexiSched Logo" className="w-24 mb-4" />
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-xl font-semibold text-center text-gray-700 mb-6">
            Employee Login
          </h3>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter Email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="***********"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center text-sm mb-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember Me
              </label>
              <a href="/forgot-password" className="text-blue-500 hover:underline">
                Forgot Password?
              </a>
            </div>
            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded flex justify-center items-center"
              onClick={handleSubmit}
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <p className="text-center text-sm mt-4">
            <a href="/register" className="text-blue-500">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;