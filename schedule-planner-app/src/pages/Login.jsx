import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import a2kLogo from "../assets/a2klogo.png"; 
import flexiSchedLogo from "../assets/logo.png"; 
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
      setFormData({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const validateForm = () => {
    let validationErrors = {};

    if (!formData.email) {
      validationErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      validationErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      validationErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return; // Stop if validation fails

    dispatch({ type: "LOGIN_START" });

    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", formData);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      localStorage.setItem("userId", res.data.user._id);

      // Save credentials if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
        localStorage.setItem("rememberedPassword", formData.password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      navigate("/homepage");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid credentials";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      setFormData({ email: "", password: "" });
    }
  };

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
                name="email"
                placeholder="Enter Email"
                className={`w-full px-4 py-2 mt-2 border rounded-md focus:ring ${
                  errors.email ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-300"
                } focus:outline-none`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            {/* Password Input */}
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="***********"
                className={`w-full px-4 py-2 mt-2 border rounded-md focus:ring ${
                  errors.password ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-300"
                } focus:outline-none`}
                value={formData.password}
                onChange={handleChange}
              />
              <span
                className="absolute right-3 top-10 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            {/* Remember Me & Forgot Password */}
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
              <a href="/forgot-password" className="text-blue-500 hover:underline">
                Forgot Password?
              </a>
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
          <p className="text-center text-sm mt-4">
            <a href="/register" className="text-blue-500">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;