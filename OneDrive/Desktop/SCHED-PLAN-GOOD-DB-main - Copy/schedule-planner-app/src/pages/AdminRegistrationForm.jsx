import { useState } from "react";
import axios from "axios";
import logo from "../assets/a2klogo.png";
import logoApp from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const AdminRegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate()

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    setLoading(false)

    if (!formData.firstname) validationErrors.firstname = "First name is required";
    if (!formData.lastname) validationErrors.lastname = "Last name is required";
    if (!formData.email) {
      validationErrors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      validationErrors.email = "Valid email is required";
    }
    if (!formData.department) validationErrors.department = "Department is required";

    // Password validation
    if (!formData.password) {
      validationErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = "Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true)
      try {
        const response = await axios.post("http://localhost:4000/api/auth/admin/register", formData, {
          headers: { "Content-Type": "application/json" },
        });
  
        if (response.status === 200) {
          alert(response.data.message);
          console.log(formData);
          navigate("/admin/login")
          
        }
      } catch (error) {
        setError(error.response?.data?.message)
        setLoading(false)
      }
    } else {
      setErrors(validationErrors);
      setLoading(false)
    }
  };

  const getInputClasses = (field) => {
    return `p-2 border rounded w-full ${
      errors[field] ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
    }`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Left Logo */}
      <img src={logo} alt="Logo" className="absolute top-4 left-4 w-32 h-32" />
    
      {/* Right Logo */}
      <img src={logoApp} alt="Logo" className="absolute top-4 right-4 w-32 h-32" />
    
      <div className="w-full max-w-md">
        <div className="w-full max-w-md">
        
          <h2 className="text-2xl font-bold mb-2 text-left">Create admin account</h2> 
          <div className="p-8 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Firstname</label>
                  <input
                    type="text"
                    name="firstname"
                    placeholder="Firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    className={getInputClasses("firstname")}
                  />
                  {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Lastname</label>
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className={getInputClasses("lastname")}
                  />
                  {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={getInputClasses("email")}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={getInputClasses("department")}
                >
                  <option value="">Select Department</option>
                  <option value="Technical">Technical</option>
                  <option value="IT Support">IT Support</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Research">Research</option>
                </select>
                {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={getInputClasses("password")}
                  />
                  <span
                    className="absolute right-3 top-10 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                <div className="relative">
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={getInputClasses("confirmPassword")}
                  />
                  <span
                    className="absolute right-3 top-10 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                ) : (
                  "Register"
                )}
              </button>
            </form>
            <p className="text-center text-sm mt-4">
              Already have an <a href="/admin/login" className="text-blue-500">account?</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrationForm;