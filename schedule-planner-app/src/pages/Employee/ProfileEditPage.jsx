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
  const [selectedImage, setSelectedImage] = useState(null);

  const userId = localStorage.getItem("userId");

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

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "jm-employ"); // Replace with Cloudinary upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxofaxn5o", // Replace 'your-cloud-name'
        formData
      );
      return response.data.secure_url; // Return the image URL
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed");
      return null;
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('firstname', user.firstname);
    formData.append('lastname', user.lastname);
    formData.append('email', user.email);
    formData.append('department', user.department);
    if (selectedImage) {
        formData.append('image', selectedImage); // Append the image file
    }

    try {
        await axios.put(`http://localhost:4000/api/edit/${userId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        toast.success('Updated user successfully');
        navigate('/profile');
    } catch (error) {
        toast.error(error.response?.data?.message || error.message);
    } finally {
        setIsLoading(false);
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

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <NavbarEmployee />
  
      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8 flex justify-center items-center">
        <div className="w-full max-w-md bg-white shadow-lg p-4 sm:p-6 rounded-lg mt-4">
          <h2 className="font-semibold text-lg sm:text-xl mb-4 text-center">Edit Profile</h2>
          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <form onSubmit={updateUser}>
              <div className="space-y-4">
                <div className="text-center">
                  {user.image && (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-3 object-cover"
                    />
                  )}
                </div>
  
                {/* Profile Image Input */}
                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-semibold">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border p-2 text-sm text-gray-600 rounded focus:outline-none focus:border-blue-300"
                  />
                </div>
  
                {/* Firstname */}
                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-semibold">Firstname</label>
                  <input
                    type="text"
                    name="firstname"
                    value={user.firstname}
                    onChange={handleChange}
                    placeholder="Firstname"
                    className="w-full border p-2 text-sm text-gray-600 rounded focus:outline-none focus:border-blue-300"
                  />
                </div>
  
                {/* Lastname */}
                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-semibold">Lastname</label>
                  <input
                    type="text"
                    name="lastname"
                    value={user.lastname}
                    onChange={handleChange}
                    placeholder="Lastname"
                    className="w-full border p-2 text-sm text-gray-600 rounded focus:outline-none focus:border-blue-300"
                  />
                </div>
  
                {/* Email */}
                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full border p-2 text-sm text-gray-600 rounded focus:outline-none focus:border-blue-300"
                  />
                </div>
  
                {/* Department */}
                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-semibold">Department</label>
                  <select
                    name="department"
                    value={user.department}
                    onChange={handleChange}
                    className="w-full border p-2 text-sm text-gray-600 rounded focus:outline-none focus:border-blue-300"
                  >
                    <option value="">Select Department</option>
                    <option value="Technical">Technical</option>
                    <option value="IT Support">IT Support</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Research">Research</option>
                  </select>
                </div>
  
                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-700 text-white rounded px-4 py-2 text-sm font-bold hover:bg-blue-600 transition duration-200"
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

