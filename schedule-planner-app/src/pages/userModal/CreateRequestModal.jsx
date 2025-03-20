import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { CreateShift } from "../../api/database";

const CreateShiftModal = ({ isOpen, onClose, shiftDate, onShiftAdded }) => {
  if (!isOpen) return null;
  const navigate = useNavigate()

  const [assignedEmployees, setSelectedUsers] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: shiftDate,
    startTime: "",
    endTime: "",
    department: "",
    shiftType: "",
    assignedEmployees: [],
  });

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );

    setFormData((prev) => ({
      ...prev,
      assignedEmployees: assignedEmployees.includes(userId)
        ? assignedEmployees.filter((id) => id !== userId)
        : [...assignedEmployees, userId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      const shiftUpdating = new Date(formData.date).toISOString().split("T")[0]
      const result = await Swal.fire({
        title: "Creating Schedule",
        text: `Are you sure you want to create schedule for ${shiftUpdating} ?`, // 
        icon: "warning", 
        showCancelButton: true,
        confirmButtonColor: "#3d3", // Green
        cancelButtonColor: "#3085d6", // Blue
        confirmButtonText: "Yes, create it!",
        });
           
        if (result.isConfirmed) {
            try {
              setisLoading(true)
              const createShift = await CreateShift(formData); 
              Swal.fire("Added!", "The shift has been Added.", "success");
              onShiftAdded();
              onClose();
              navigate("/admin/manage-shift");
        } catch (error) {
              alert(error.response?.data?.message || "An error occurred");
              onClose();
              navigate("/admin/manage-shift");
            }
              setisLoading(false)
          }
    }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { data, loading, error } = useFetch("http://localhost:4000/api/user/");

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
            <h2 className="text-xl font-semibold mb-4">Create New Schedule</h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 gap-4">
                {/* Left Side - Form Inputs (1 column) */}
                <div className="col-span-1">
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      disabled
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium">Shift Type</label>
                    <select
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
                      <div className="grid grid-cols-4 gap-2">
                        {data.map((user) => {
                          const isSelected = formData.assignedEmployees.includes(user._id);

                          return (
                            <label
                              key={user._id}
                              className={`flex items-center space-x-2 p-1 rounded cursor-pointer transition-all ${
                                isSelected ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                              }`}
                              onClick={(e) => {
                                e.preventDefault(); // Prevent label from triggering unwanted behaviors
                                handleUserSelection(user._id);
                              }}
                            >
                              <input
                                type="checkbox"
                                value={user._id}
                                checked={isSelected}
                                readOnly // Prevent default input change handling
                                className="hidden"
                              />
                              <span className="whitespace-nowrap">{user.firstname}</span>
                            </label>
                          );
                        })}
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
                  className="bg-gray-500 text-white px-4 py-2 rounded flex items-center justify-center w-24"
                 
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center w-42"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    "Create Schedule"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

  
  );
};

export default CreateShiftModal;
