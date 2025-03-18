import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthContext";
import NavbarAdmin from "../../components/NavbarAdmin";

const AdminProfileEditPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    department: "",
    image: "", // Add image URL to the state
  });

  // Retrieve user ID from local storage
  const userId = localStorage.getItem('userId');

  const getUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/edit/${userId}`);
      setUser({
        firstname: response.data.firstname,
        lastname: response.data.lastname,
        email: response.data.email,
        department: response.data.department,
        image: response.data.image, // Include image URL
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    if (!user.firstname || !user.lastname || !user.email || !user.department || !user.image) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      await axios.put(`http://localhost:4000/api/edit/${userId}`, user);
      toast.success("Updated user successfully");
      navigate("/admin/profile");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      getUser();
    } else {
      toast.error("User ID not found in local storage.");
      navigate("/admin/login");
    }
  }, [userId]); // Ensure it runs when `userId` changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <NavbarAdmin />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-lg bg-white shadow-lg mx-auto p-7 rounded mt-6">
          <h2 className="font-semibold text-2xl mb-4 block text-center">Edit Profile</h2>
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              <form onSubmit={updateUser}>
                <div className="space-y-4">
                  <div className="text-center">
                    {user.image && (
                      <img
                        src={user.image}
                        alt="Profile"
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-gray-600 mb-2 block font-semibold">Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={user.image}
                      onChange={handleChange}
                      className="w-full block border p-3 text-gray-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                      placeholder="Image URL"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 mb-2 block font-semibold">Firstname</label>
                    <input
                      type="text"
                      name="firstname"
                      value={user.firstname}
                      onChange={handleChange}
                      className="w-full block border p-3 text-gray-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                      placeholder="Firstname"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 mb-2 block font-semibold">Lastname</label>
                    <input
                      type="text"
                      name="lastname"
                      value={user.lastname}
                      onChange={handleChange}
                      className="w-full block border p-3 text-gray-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                      placeholder="Lastname"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 mb-2 block font-semibold">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      className="w-full block border p-3 text-gray-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 mb-2 block font-semibold">Department</label>
                    <select
                      name="department"
                      value={user.department}
                      onChange={handleChange}
                      className="p-3 border rounded w-full text-gray-600 focus:outline-none focus:shadow-outline focus:border-blue-200"
                    >
                      <option value="">Select Department</option>
                      <option value="Technical">Technical</option>
                      <option value="IT Support">IT Support</option>
                      <option value="Sales & Marketing">Sales & Marketing</option>
                      <option value="Research">Research</option>
                    </select>
                  </div>
                  <div>
                    <button
                      className="block w-full mt-6 bg-blue-700 text-white rounded-sm px-4 py-2 font-bold hover:bg-blue-600 hover:cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfileEditPage;