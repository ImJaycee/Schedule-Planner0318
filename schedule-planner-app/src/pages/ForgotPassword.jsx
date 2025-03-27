import React, { useState } from "react";
import lockIcon from "../assets/unlock.png"; // Lock icon image
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:4000/api/auth/forgetPassword", { email });

      if (response.status === 200) {
        alert("Reset link sent! Check your email.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <img src={lockIcon} alt="Lock Icon" className="w-12 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Forgot Password?</h2>
        <p className="text-gray-600 text-sm mb-4">You can reset your password here</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full px-4 py-2 border rounded-md mb-4 focus:ring focus:ring-blue-300 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`w-full text-white py-2 rounded-md transition ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;