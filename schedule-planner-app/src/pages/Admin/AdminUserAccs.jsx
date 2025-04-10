import React, { useEffect, useState, useCallback, useContext } from 'react';
import NavbarAdmin from '../../components/NavbarAdmin';
import Pagination from '../../components/Pagination';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { debounce } from 'lodash';
import { AuthContext } from '../../context/AuthContext';

const UserAccs = () => {
  const { user } = useContext(AuthContext);
  const department = user.user?.department;

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(4);
  const [formMode, setFormMode] = useState('create');
  const [formData, setFormData] = useState({ firstname: "", lastname: "", email: "", password: "", isAdmin: false, isVerified: true, department });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Retrieve the accessToken from local storage
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (department) {
      fetchUsers();
    }
  }, [department]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`http://localhost:4000/api/user-manage/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { department }
      });
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstname) newErrors.firstname = "First name is required";
    if (!formData.lastname) newErrors.lastname = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (formMode === 'create' && !formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    try {
      await axios.post('http://localhost:4000/api/user-manage/create', { ...formData, department }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User created successfully");
      fetchUsers();
      handleCancel();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    try {
      const updatedData = { ...formData, department };
      if (!updatedData.password) {
        delete updatedData.password;
      }
      await axios.put(`http://localhost:4000/api/user-manage/update/${formData._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User updated successfully");
      fetchUsers();
      handleCancel();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/user-manage/deactivate/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User deactivated successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to deactivate user");
    }
  };

  const handleActivate = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/user-manage/activate/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User activated successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to activate user");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formMode === 'create') {
      handleCreate();
    } else {
      handleUpdate();
    }
  };

  const handleCancel = () => {
    setFormMode('create');
    setFormData({ firstname: "", lastname: "", email: "", password: "", isAdmin: false, isVerified: true, department });
    setErrors({});
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSearch = useCallback(
    debounce((term) => {
      if (term) {
        const filtered = users.filter(user =>
          user.firstname.toLowerCase().includes(term.toLowerCase()) ||
          user.lastname.toLowerCase().includes(term.toLowerCase()) ||
          user.email.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers(users);
      }
    }, 300),
    [users]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <NavbarAdmin />
      <div className="flex-1 p-4 md:p-6 flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Create/Update User Section */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-2xl md:text-3xl font-bold text-blue-600 mb-6 flex items-center">
            {formMode === 'create' ? (
              <>
                <span className="mr-2">➕</span> Create User
              </>
            ) : (
              <>
                <span className="mr-2">✏️</span> Update User
              </>
            )}
          </h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Form Fields */}
            {['firstname', 'lastname', 'email'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field.replace(/name/, ' Name')}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  placeholder={`Enter ${field}`}
                  className={`input p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 ${
                    errors[field] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData[field]}
                  onChange={(e) => {
                    setFormData({ ...formData, [field]: e.target.value });
                    if (errors[field]) {
                      setErrors((prev) => ({ ...prev, [field]: null }));
                    }
                  }}
                />
                {errors[field] && <p className="text-red-500 text-xs italic">{errors[field]}</p>}
              </div>
            ))}
  
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  className={`input p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: null }));
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
            </div>
  
            {/* Buttons */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="submit"
                className="btn bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 w-full md:w-auto"
              >
                {formMode === 'create' ? 'Create' : 'Update'}
              </button>
              {formMode === 'update' && (
                <button
                  type="button"
                  className="btn bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 mt-2 md:mt-0 w-full md:w-auto"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
  
        {/* All Users Section */}
        <div className="w-full md:w-2/3 bg-white p-4 rounded shadow-md">
          <h3 className="text-xl md:text-2xl font-bold mb-4">All Users</h3>
          <input
            type="text"
            placeholder="Search by first name, last name, or email"
            className="input mb-4 p-2 border rounded w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
              <thead>
                <tr>
                  {['First Name', 'Last Name', 'Email', 'Department', 'Status', 'Actions'].map((header) => (
                    <th key={header} className="py-2 px-4 border-b text-left">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="py-2 px-4 border-b">{user.firstname}</td>
                    <td className="py-2 px-4 border-b">{user.lastname}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{user.department}</td>
                    <td className="py-2 px-4 border-b">
                      {user.isDeactivated ? 'Deactivated' : 'Active'}
                    </td>
                    <td className="py-2 px-4 border-b whitespace-nowrap">
                      {user.isDeactivated ? (
                        <button
                          className="btn bg-green-500 w-20 text-sm text-white px-3 py-1 rounded mr-2"
                          onClick={() => handleActivate(user._id)}
                        >
                          Activate
                        </button>
                      ) : (
                        <button
                          className="btn bg-red-500 w-20 text-sm text-white px-3 py-1 rounded mr-2"
                          onClick={() => {
                            handleDeactivate(user._id);
                            setErrors({});
                          }}
                        >
                          Deactivate
                        </button>
                      )}
                      <button
                        className="btn bg-blue-500 w-20 text-sm text-white px-3 py-1 rounded"
                        onClick={() => {
                          setFormMode('update');
                          setFormData({ ...user, password: '' });
                          setErrors({});
                        }}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredUsers.length / usersPerPage)}
            onPageChange={paginate}
          />
        </div>
      </div>
    </div>
  );
  
};

export default UserAccs;