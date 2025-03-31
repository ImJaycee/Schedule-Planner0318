import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { DeclineRequestAdmin,AcceptRequestAdmin} from "../../api/requestSwap";


const SwapModal = ({ isOpen, onClose, reloadRequest, request }) => {
  if (!isOpen || !request) return null;

  const [adminMessage, setAdminMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()

  const handleSubmit = async (status) => {
    const requestData = {
      requestSwapId: request._id, // Hidden input value
      adminMessage,
    };

    const result = await Swal.fire({
      title: `Confirm Shift Request`,
      text: `Are you sure you want to ${status} request?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3d3",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Confirm`,
  });
  
      if (result.isConfirmed) {
          try {
              setIsLoading(true);
              if (status === "approved") {
                  const response = await AcceptRequestAdmin(requestData);
                  console.log("Response from AcceptRequestAdmin:", response);
                  Swal.fire("Success!", `The request has been approved.\n${response?.message || "No response message available."}`, "success");
              } else if (status === "rejected") {
                  await DeclineRequestAdmin(requestData);
                  Swal.fire("Success!", "The request has been rejected.", "success");
              }
              reloadRequest();
              onClose();
              navigate("/admin/request-shift/swaps");
          } catch (error) {
              Swal.fire("Error", error.response?.data?.message || "An error occurred", "error");
          } finally {
              setIsLoading(false);
          }
      }
      
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Request For Swap Details</h2>
        
        <p><strong>Requested By:</strong> {request.requestedBy.firstname} {request.requestedBy.lastname}</p>
        <p><strong>Shift:</strong> {new Date(request.requesterShiftId.date).toLocaleDateString()} - {request.RequesterST}</p>
        <p><strong>Requester Message:</strong> {request.requesterMessage}</p>
        <p><strong>Requested To:</strong> {request.requestedTo.firstname} {request.requestedTo.lastname}</p>
        <p><strong>Shift:</strong> {new Date(request.requestingShiftId.date).toLocaleDateString()} - {request.RecipientST}</p>
        <p><strong>Recipient Message:</strong> {request.recipientMessage}</p>

        {/* Form for admin response */}
        <form onSubmit={(e) => e.preventDefault()} className="mt-4">
          <input type="hidden" name="requestSwapId" value={request._id} />

          <label className="block text-sm font-medium">Admin Message:</label>
          <textarea
            className="w-full p-2 border rounded mt-1"
            value={adminMessage}
            onChange={(e) => setAdminMessage(e.target.value)}
          ></textarea>

          <div className="flex justify-between mt-4">
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={() => handleSubmit("approved")}
            disabled={isLoading} 
            >
            {isLoading ? "Processing..." : "Approve"}
            </button>

            <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={() => handleSubmit("rejected")}
            disabled={isLoading} 
            >
            {isLoading ? "Processing..." : "Reject"}
            </button>
          </div>
        </form>

        <button className="mt-4 text-gray-500" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SwapModal;