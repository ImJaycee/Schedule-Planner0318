import React from "react";

const ShiftModal = ({ isOpen, onClose, shifts }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Shift Details</h2>
        
        {shifts.length > 0 ? (
          shifts.map((shift, index) => (
            
            <div key={index} className="mb-2 p-2 border-b">
              <p>
                <strong>Time:</strong> {new Date(shift.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })} - 
                {new Date(shift.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
              </p>
              <p><strong>Office Schedule</strong> {shift.employees}</p>
              <p><strong>Type:</strong> {shift.color === "green" ? "Morning" : "Night"}</p>

            </div>
          ))
        ) : (
          <p>No shifts scheduled.</p>
        )}

        <button 
          onClick={onClose} 
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default ShiftModal;
