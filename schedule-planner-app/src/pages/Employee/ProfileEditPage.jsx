import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthContext";
import NavbarEmployee from "../../components/NavbarEmployee";

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    department: "",
    image: "",
  });

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
        image: response.data.image,
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
      navigate("/profile");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      getUser();
    } else {
      toast.error("User ID not found in local storage.");
      navigate("/login");
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <NavbarEmployee />

      <div className="flex-10 p-8 flex justify-center items-center">
        <div className="max-w-sm w-3/4 bg-white shadow-lg p-4 rounded mt-4">
          <h2 className="font-semibold text-lg mb-3 text-center">Edit Profile</h2>
          {isLoading ? (
            "Loading..."
          ) : (
            <form onSubmit={updateUser}>
              <div className="space-y-3">
                <div className="text-center">
                  {user.image && (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                    />
                  )}
                </div>
                <div>
                  <label className="text-gray-600 mb-1 block text-sm font-semibold">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={user.image}
                    onChange={handleChange}
                    className="w-full block border p-2 text-sm text-gray-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                    placeholder="Image URL"
                  />
                </div>
                <div>
                  <label className="text-gray-600 mb-1 block text-sm font-semibold">Firstname</label>
                  <input
                    type="text"
                    name="firstname"
                    value={user.firstname}
                    onChange={handleChange}
                    className="w-full block border p-2 text-sm text-gray-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                    placeholder="Firstname"
                  />
                </div>
                <div>
                  <label className="text-gray-600 mb-1 block text-sm font-semibold">Lastname</label>
                  <input
                    type="text"
                    name="lastname"
                    value={user.lastname}
                    onChange={handleChange}
                    className="w-full block border p-2 text-sm text-gray-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                    placeholder="Lastname"
                  />
                </div>
                <div>
                  <label className="text-gray-600 mb-1 block text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    className="w-full block border p-2 text-sm text-gray-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label className="text-gray-600 mb-1 block text-sm font-semibold">Department</label>
                  <select
                    name="department"
                    value={user.department}
                    onChange={handleChange}
                    className="p-2 border rounded w-full text-sm text-gray-600 focus:outline-none focus:shadow-outline focus:border-blue-200"
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
                    className="block w-full mt-4 bg-blue-700 text-white rounded-sm px-3 py-1 text-sm font-bold hover:bg-blue-600 hover:cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;