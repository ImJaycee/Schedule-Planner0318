import React, { useEffect, useState } from "react";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CreateShift, UpdateShift, DeleteShift }from "../../../src/api/database";

const UpdateShiftModal = ({ isOpen, onClose, shiftDate, onShiftUpdated, shiftId }) => {
  if (!isOpen) return null;
  const navigate = useNavigate()

  const [assignedEmployees, setSelectedUsers] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: shiftDate || "",
    startTime: "",
    endTime: "",
    department: "",
    shiftType: "",
    assignedEmployees: [],
  });

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  
    setFormData((prev) => ({
      ...prev,
      assignedEmployees: prev.assignedEmployees.includes(userId)
        ? prev.assignedEmployees.filter((id) => id !== userId)
        : [...prev.assignedEmployees, userId],
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const shiftUpdating = new Date(formData.date).toISOString().split("T")[0]
    const result = await Swal.fire({
      title: "Updating Schedule",
      text: `Are you sure you want to update ${shiftUpdating} schedule?`, // 
      icon: "warning", 
      showCancelButton: true,
      confirmButtonColor: "#3d3", // Green
      cancelButtonColor: "#3085d6", // Blue
      confirmButtonText: "Yes, update it!",
    });
  
    if (result.isConfirmed) {
      try {
        setisLoading(true)
          const updatedShift = await UpdateShift(formData, shiftId); 

          Swal.fire("Updated!", "The shift has been updated.", "success");
          onShiftUpdated();
          onClose();
          navigate("/admin/manage-shift");
        } catch (error) {
          alert(error.response?.data?.message || "An error occurred");
          onClose();
          navigate("/admin/manage-shift");
        }
        setisLoading(false)
        };

      }

  const handleDelete = async (e) => {
    e.preventDefault();
  
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (result.isConfirmed) {
      try {
        setisLoading(true)
        console.log(shiftId)
        const updatedShift = await DeleteShift(shiftId);
  
        Swal.fire("Deleted!", "The shift has been deleted.", "success");
        onShiftUpdated();
        onClose();
        navigate("/admin/manage-shift");
      } catch (error) {
        Swal.fire("Error!", error.response?.data?.message || "An error occurred", "error");
        onClose();
        navigate("/admin/manage-shift");
      }
      setisLoading(false)
    }
  };


  const { data, loading, error } = useFetch(`http://localhost:4000/api/shift/${shiftId}`);
  useEffect(() => {
    if (data) {
      setFormData({
        date: data.date || "",
        startTime: data.startTime || "",
        endTime: data.endTime || "",
        department: data.department || "",
        shiftType: data.shiftType || "",
        assignedEmployees: data.assignedEmployees || [],
      });
      setSelectedUsers(data.assignedEmployees || []);
      setisLoading(false)
    }
  }, [data]);

  const [employees, setEmployees] = useState([]);

useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const res = await axios.get("http://localhost:4000/api/user/",{
        headers: { Authorization: `Bearer ${token}` }, // Attach token
        withCredentials: true,
      });
      setEmployees(res.data); 
      console.log(res.data)
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };
  
  fetchEmployees();
}, []);



const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

  

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
            <h2 className="text-xl font-semibold mb-4">Update Schedule</h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 gap-4">
                {/* Left Side - Form Inputs (1 column) */}
                <div className="col-span-1">
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Date</label>
                    <input
                    readOnly
                      type="date"
                      name="date"
                      value={data?.date ? new Date(data.date).toISOString().split("T")[0] : ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      disabled
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium">Shift Type</label>
                    <select
                    required
                      name="shiftType"
                      value={formData.shiftType}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Shift</option>
                      <option value="morning">Morning</option>
                      <option value="night">Night</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>

                {/* Right Side - Employee Selection (2 columns) */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Assign Employees</label>
                  <div className="max-h-60 overflow-y-auto border p-2 rounded">
                    {loading ? (
                      <p>Loading...</p>
                    ) : error ? (
                      <p>Error loading users</p>
                    ) : (
                      <div className="max-h-60 overflow-y-auto border p-2 rounded">
                          {loading ? (
                            <p>Loading...</p>
                          ) : error ? (
                            <p>Error loading users</p>
                          ) : (
                            <div className="grid grid-cols-4 gap-2">
                              {employees.map((user) => {
                                const isSelected = formData.assignedEmployees.includes(user._id);
                                return (
                                  <label
                                    key={user._id}
                                    className={`flex items-center space-x-2 p-1 rounded cursor-pointer transition-all ${
                                      isSelected ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                    onClick={(e) => {
                                      e.preventDefault(); // Prevent unwanted behaviors
                                      handleUserSelection(user._id);
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      value={user._id}
                                      checked={isSelected}
                                      readOnly
                                      className="hidden"
                                    />
                                    <span className="whitespace-nowrap">{user.firstname}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>

                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center w-24"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    "Update"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded flex items-center justify-center w-24"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    "Delete"
                  )}
                </button>

              </div>
            </form>
          </div>
        </div>

  
  );
};

export default UpdateShiftModal;
