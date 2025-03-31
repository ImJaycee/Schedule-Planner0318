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
    formData.append("upload_preset", "jm-employ"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxofaxn5o/image/upload", // Replace 'your-cloud-name'
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
    formData.append("firstname", user.firstname);
    formData.append("lastname", user.lastname);
    formData.append("email", user.email);
    formData.append("department", user.department);
    if (selectedImage) {
        formData.append("image", selectedImage); // Append the image file
    }

    try {
        await axios.put(`http://localhost:4000/api/edit/${userId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Updated user successfully");
        navigate("/admin/profile");
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
      navigate("/admin/login");
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
    <div className="flex h-screen bg-gray-100">
      <NavbarAdmin />

      <div className="flex-1 p-6 flex justify-center items-center">
        <div className="max-w-sm w-full bg-white shadow-lg p-6 rounded-lg">
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
                  <label className="text-gray-600 mb-1 block text-sm font-semibold">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full block border p-2 text-sm text-gray-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
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

export default AdminProfileEditPage;