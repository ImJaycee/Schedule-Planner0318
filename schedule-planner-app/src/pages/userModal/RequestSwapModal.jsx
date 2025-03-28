import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RequestSwapModal = ({ isOpen, onClose, shiftDate, shiftId, onSwapRequested }) => {
  if (!isOpen) return null;
  const navigate = useNavigate();

  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    requestDate: "", // The date user wants to swap to
    offeringDate: "", // The user's current schedule date
  });

  const [shiftDetails, setShiftDetails] = useState({
    date: shiftDate || "",
    startTime: "",
    endTime: "",
    department: "",
    shiftType: "",
  });

  // Fetch shift details including assigned employees
  useEffect(() => {
    const fetchShiftDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/api/shift/${shiftId}`);
        setShiftDetails({
          date: data.date || "",
          startTime: data.startTime || "",
          endTime: data.endTime || "",
          department: data.department || "",
          shiftType: data.shiftType || "",
        });
        setAssignedEmployees(data.assignedEmployees || []);
      } catch (error) {
        console.error("Error fetching shift details:", error);
      }
    };

    fetchShiftDetails();
  }, [shiftId]);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle user selection for swap
  const handleEmployeeSelection = (userId) => {
    setSelectedEmployee(userId);
  };

  // Handle swap request submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployee) {
      Swal.fire("Error", "Please select an employee to swap with.", "error");
      return;
    }

    if (!formData.offeringDate || !formData.requestDate) {
      Swal.fire("Error", "Please enter both your offering and requested dates.", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Confirm Swap Request",
      text: `Do you want to request a schedule swap for ${formData.requestDate}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, send request",
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        await axios.post("http://localhost:4000/api/swap-request", {
          shiftId,
          requestedEmployeeId: selectedEmployee,
          offeringDate: formData.offeringDate,
          requestDate: formData.requestDate,
        });

        Swal.fire("Success!", "Your swap request has been sent.", "success");
        onSwapRequested();
        onClose();
        navigate("/employee/schedule");
      } catch (error) {
        console.error("Error submitting swap request:", error);
        Swal.fire("Error", "Failed to send swap request. Try again.", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Request Schedule Swap</h2>

        <form onSubmit={handleSubmit}>
          {/* Offering Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Your Offering Date</label>
            <input
              type="date"
              name="offeringDate"
              value={formData.offeringDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Requested Swap Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Swap to This Date</label>
            <input
              type="date"
              name="requestDate"
              value={formData.requestDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Employee Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Select Employee to Swap With</label>
            <div className="max-h-60 overflow-y-auto border p-2 rounded">
              {assignedEmployees.length === 0 ? (
                <p className="text-sm text-gray-500">No employees available for swap.</p>
              ) : (
                assignedEmployees.map((user) => (
                  <label
                    key={user._id}
                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-all ${
                      selectedEmployee === user._id ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedEmployee"
                      value={user._id}
                      checked={selectedEmployee === user._id}
                      onChange={() => handleEmployeeSelection(user._id)}
                      className="hidden"
                    />
                    <span className="whitespace-nowrap">{user.firstname} {user.lastname}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
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
                "Send Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestSwapModal;
