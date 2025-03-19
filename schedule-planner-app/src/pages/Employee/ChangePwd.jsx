import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthContext";
import NavbarEmployee from "../../components/NavbarEmployee";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePwd = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user: authUser } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Retrieve user ID from local storage
  const userId = localStorage.getItem('userId');

  const validate = () => {
    const newErrors = {};
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      await axios.put(`http://localhost:4000/api/edit/${userId}/password`, { password, confirmPassword });
      toast.success("Password updated successfully");
      setPassword("");
      setConfirmPassword("");
      navigate("/profile");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrors({ apiError: error.response.data.message });
      } else {
        setErrors({ apiError: error.message });
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <NavbarEmployee />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-lg bg-white shadow-lg mx-auto p-7 rounded mt-6">
          <h2 className="font-semibold text-2xl mb-4 block text-center">Change Password</h2>
          <form onSubmit={updatePassword}>
            <div className="space-y-4">
              <div className="relative">
                <label className="text-gray-600 mb-2 block font-semibold">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full block border p-3 rounded focus:outline-none focus:shadow-outline placeholder-gray-400 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="New Password"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
                {errors.password && <p className="text-red-600 mt-1">{errors.password}</p>}
              </div>
              <div className="relative">
                <label className="text-gray-600 mb-2 block font-semibold">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full block border p-3 rounded focus:outline-none focus:shadow-outline placeholder-gray-400 ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Confirm Password"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
                {errors.confirmPassword && <p className="text-red-600 mt-1">{errors.confirmPassword}</p>}
              </div>
              {errors.apiError && <p className="text-red-600 mt-1">{errors.apiError}</p>}
              <div>
                <button
                  className="block w-full mt-6 bg-blue-700 text-white rounded-sm px-4 py-2 font-bold hover:bg-blue-600 hover:cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePwd;