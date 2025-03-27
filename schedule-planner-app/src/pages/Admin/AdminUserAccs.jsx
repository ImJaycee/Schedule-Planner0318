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
    <div className="flex h-screen bg-gray-100">
      <NavbarAdmin />
      <div className="flex-1 p-6 flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 bg-white p-4 rounded shadow-md">
          <h3 className="text-2xl font-bold mb-4">{formMode === 'create' ? 'Create User' : 'Update User'}</h3>
          <form onSubmit={handleFormSubmit} className="mb-4 space-y-4">
            <input
              type="text"
              placeholder="First Name"
              className={`input mb-2 p-2 border rounded w-full ${errors.firstname ? 'border-red-500' : ''}`}
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            />
            {errors.firstname && <p className="text-red-500 text-xs italic">{errors.firstname}</p>}
            <input
              type="text"
              placeholder="Last Name"
              className={`input mb-2 p-2 border rounded w-full ${errors.lastname ? 'border-red-500' : ''}`}
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            />
            {errors.lastname && <p className="text-red-500 text-xs italic">{errors.lastname}</p>}
            <input
              type="email"
              placeholder="Email"
              className={`input mb-2 p-2 border rounded w-full ${errors.email ? 'border-red-500' : ''}`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`input p-2 border rounded w-full ${errors.password ? 'border-red-500' : ''}`}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <button type="button" onClick={togglePasswordVisibility} className="focus:outline-none">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
            <div className="flex space-x-2">
              <button type="submit" className="btn bg-blue-500 text-white p-2 rounded">{formMode === 'create' ? 'Create' : 'Update'}</button>
              {formMode === 'update' && <button type="button" className="btn bg-gray-500 text-white p-2 rounded" onClick={handleCancel}>Cancel</button>}
            </div>
          </form>
        </div>
        <div className="md:w-1/2 bg-white p-4 rounded shadow-md">
          <h3 className="text-2xl font-bold mb-4">All Users</h3>
          <input
            type="text"
            placeholder="Search by first name, last name, or email"
            className="input mb-4 p-2 border rounded w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">First Name</th>
                  <th className="py-2 px-4 border-b">Last Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Department</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <tr key={user._id}>
                    <td className="py-2 px-4 border-b">{user.firstname}</td>
                    <td className="py-2 px-4 border-b">{user.lastname}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{user.department}</td>
                    <td className="py-2 px-4 border-b">{user.isDeactivated ? "Deactivated" : "Active"}</td>
                    <td className="py-2 px-4 border-b">
                      {user.isDeactivated ? (
                        <button className="btn bg-green-500 text-white p-2 rounded ml-2" onClick={() => handleActivate(user._id)}>Activate</button>
                      ) : (
                        <button className="btn bg-red-500 text-white p-2 rounded ml-2" onClick={() => { handleDeactivate(user._id); setErrors({}); }}>Deactivate</button>
                      )}
                      <button className="btn bg-yellow-500 text-white p-2 rounded ml-2" onClick={() => { 
                        setFormMode('update'); 
                        setFormData({ ...user, password: "" }); // Clear the password field when updating
                        setErrors({});
                      }}>Update</button>
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