import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { CreateShiftRequest } from "../../api/requestDB";
import useFetch from "../../hooks/useFetch";

const CreateRequestModal = ({ isOpen, onClose, shiftDate, requestAdded, shiftId, shifts}) => {
  if (!isOpen) return null;


  
  const navigate = useNavigate();
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shift_Type, setShiftType] = useState("");

  const [formData, setFormData] = useState({
    date: shiftDate,
    startTime: "",
    endTime: "",
    shiftType: "",
    requestedBy: "",
    userMessage: "",
    currentShift: shifts
  });


  const handleUserSelection = (userId) => {
    setAssignedEmployees((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
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
    console.log(formData.date)

    const result = await Swal.fire({
        title: `Confirm Shift Request`,
        text: `Are you sure you want to request ${formData.shiftType} shift for ${shiftDate}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3d3",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, create it!",
    });

    if (result.isConfirmed) {
        try {
            setIsLoading(true);
            await CreateShiftRequest(formData);
            Swal.fire("Success!", "The shift request has been submitted.", "success");
            requestAdded()
            onClose();
            navigate("/request-shift");
        } catch (error) {
            Swal.fire("Error", error.response?.data?.message || "An error occurred", "error");
        } finally {
            setIsLoading(false);
        }
    }
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};



  const { data, loading, error } = useFetch(`http://localhost:4000/api/shift/${shiftId}`);
  useEffect(() => {
    const userID = localStorage.getItem("userId");
    // Retrieve user data
    const userTemp = JSON.parse(localStorage.getItem("userTemp")); // Parse JSON string back to object

    // Access name properties
    const firstName = userTemp?.firstname || "Unknown"; 
    const lastName = userTemp?.lastname || "Unknown"; 
  
    if (data && data.assignedEmployees) { 

      setShiftType(data.shiftType)
  
      setFormData({
        date: data.date || "",
        startTime: data.startTime || "",
        endTime: data.endTime || "",
        requestedBy: userID,
        name: firstName + " " + lastName
      });

      setIsLoading(false);
    }
  }, [data]);
  
  
  

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Create Shift Request</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block font-semibold">Date</label>
            <input
            readOnly
              type="date"
              name="date"
              value={shiftDate ? new Date(shiftDate).toISOString().split("T")[0] : ""}
              onChange={handleChange}
              className="border w-full p-2 rounded"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block font-semibold">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="border w-full p-2 rounded"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block font-semibold">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="border w-full p-2 rounded"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block font-semibold">Shift Type</label>
            <select
              name="shiftType"
              value={formData.shiftType}
              onChange={handleChange}
              className="border w-full p-2 rounded"
              required
            >
              <option value="">Select Shift Type to Request</option>
              <option disabled={shifts === "On-site"} value="on-site">
                On-Site
              </option>
              <option disabled={shifts === "WFH"} value="wfh">
                Work From Home
              </option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block font-semibold">Request Message</label>
            <input
              type="text"
              name="userMessage"
              value={formData.userMessage}
              onChange={handleChange}
              className="border w-full p-2 rounded"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="bg-green-600 text-white px-4 py-2 rounded">
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestModal;
