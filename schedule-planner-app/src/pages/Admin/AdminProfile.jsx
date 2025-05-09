import NavbarAdmin from "../../components/NavbarAdmin";
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminProfile = () => {
  const { user: authUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    department: "",
    image: "", // Add image URL to the state
  });
  const [isLoading, setIsLoading] = useState(false);

  // Retrieve user ID from context
  const userId = authUser?.user?._id;

  const getUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/edit/${userId}`
      );
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

  useEffect(() => {
    if (userId) {
      getUser();
    } else {
      toast.error("User ID not found.");
    }
  }, [userId]);

  const handleEditProfile = () => {
    navigate("/admin/profile-edit");
  };

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <NavbarAdmin />

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center p-4 sm:p-6'>
        <div className='w-full max-w-md sm:max-w-lg md:max-w-xl bg-white shadow-lg p-6 sm:p-8 rounded-lg'>
          <h2 className='text-2xl sm:text-3xl font-semibold mb-4 text-center'>
            Welcome, {user.firstname || "User"}!
          </h2>

          {isLoading ? (
            <p className='text-center text-gray-600'>Loading...</p>
          ) : (
            <div>
              <h3 className='text-xl sm:text-2xl font-semibold mb-4 text-center'>
                Profile Details
              </h3>
              <div className='flex flex-col items-center'>
                {user.image && (
                  <img
                    src={user.image}
                    alt='Profile'
                    className='w-24 h-24 sm:w-32 sm:h-32 rounded-full mb-4 object-cover border'
                  />
                )}
                <div className='space-y-4 text-left w-full'>
                  <div>
                    <label className='block text-gray-600 font-semibold'>
                      Firstname:
                    </label>
                    <p className='text-gray-800'>{user.firstname}</p>
                  </div>
                  <div>
                    <label className='block text-gray-600 font-semibold'>
                      Lastname:
                    </label>
                    <p className='text-gray-800'>{user.lastname}</p>
                  </div>
                  <div>
                    <label className='block text-gray-600 font-semibold'>
                      Email:
                    </label>
                    <p className='text-gray-800 break-all'>{user.email}</p>
                  </div>
                  <div>
                    <label className='block text-gray-600 font-semibold'>
                      Department:
                    </label>
                    <p className='text-gray-800'>{user.department}</p>
                  </div>
                  <div className='text-center'>
                    <button
                      className='mt-4 bg-blue-700 text-white rounded px-4 py-2 font-bold hover:bg-blue-600'
                      onClick={handleEditProfile}
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
