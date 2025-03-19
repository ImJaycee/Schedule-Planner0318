import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import a2kLogo from "../assets/a2klogo.png";  // Top-left logo
import flexiSchedLogo from "../assets/logo.png";  // Centered above form
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const { user, loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  // Load saved credentials from local storage
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  // Function to validate form inputs
  const validateForm = () => {
    let validationErrors = {};

    if (!email.trim()) {
      validationErrors.email = "Email is required.";
    } else if (!email.includes("@")) {
      validationErrors.email = "Valid email is required.";
    }

    if (!password.trim()) {
      validationErrors.password = "Password is required.";
    } else if (password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop submission if errors exist

    dispatch({ type: "LOGIN_START" });

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/login/admin",
        { email, password },
        { withCredentials: true } // Ensures the cookie is stored
      );

      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      localStorage.setItem("accessToken", res.data.accessToken); // Save token
      localStorage.setItem("userId", res.data.user._id);

      // Save credentials if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      navigate("/admin/homepage");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid credentials";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      setEmail("");
      setPassword("");
    }
  };

  // Function to get dynamic input styles based on errors
  const getInputClasses = (field) => {
    return `w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none ${
      errors[field] ? "border-red-500 focus:ring-red-300" : "border-gray-300"
    }`;
  };

  return (
    <div className="flex min-h-screen bg-white relative">
      {/* Top-left A2K logo */}
      <img src={a2kLogo} alt="A2K Logo" className="absolute top-6 left-8 w-32" />

      {/* Centered Login Box */}
      <div className="flex flex-col items-center justify-center w-full">
        {/* FlexiSched Logo (above login form) */}
        <img src={flexiSchedLogo} alt="FlexiSched Logo" className="w-32 mb-4 h-25" />

        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-xl font-semibold text-center text-gray-700 mb-6">
            Admin Login
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
                className={getInputClasses("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="***********"
                className={getInputClasses("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-3 top-10 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex justify-between items-center text-sm mb-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;