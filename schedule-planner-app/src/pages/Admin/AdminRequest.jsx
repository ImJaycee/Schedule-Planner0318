
import { useEffect, useState } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import { GetAllRequest } from "../../api/requestDB";
import RequestModal from "../adminModals/requestModal";

const AdminRequests = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [reload, setReload] = useState(false);

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsRequestModalOpen(true);
  };

  const closeModal = () => {
    setIsRequestModalOpen(false);
    setSelectedRequest(null);
  };

  useEffect(() => {
    const fetchAllRequest = async () => {
      setIsLoading(true);
      try {
        const response = await GetAllRequest();
        console.log("Fetched Requests:", response);
        setRequests(response || []);
      } catch (error) {
        console.log("Error fetching requests:", error);
      } finally {
        setIsLoading(false);
        setReload(false);
      }
    };

    fetchAllRequest();
  }, [reload]);

  const filteredRequests = requests.filter((request) => {
    return (
      (
        // Search by ID
        request._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
  
        // Search by Name (Assuming request.name exists)
        (request.name &&
          request.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
  
        // Search by Shift Type
        (request.shiftType &&
          request.shiftType.toLowerCase().includes(searchTerm.toLowerCase())) ||
  
        // Search by Date (raw string)
        (request.date &&
          request.date.toLowerCase().includes(searchTerm.toLowerCase())) ||
  
        // Search by Date (formatted)
        (request.date &&
          new Date(request.date)
            .toLocaleDateString("default", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
      ) &&
  
      // Apply Status Filter correctly to the entire search
      (statusFilter === "" || request.status === statusFilter)
    );
  });
  

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <NavbarAdmin />
  
      <div className="flex-1 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">Requests</h3>
  
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search Request..."
            className="p-2 border rounded w-full sm:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded w-full sm:w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
  
        {/* Table Container */}
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Request Date</th>
                  <th className="border border-gray-300 px-4 py-2">Shift Type</th>
                  <th className="border border-gray-300 px-4 py-2">Start Time</th>
                  <th className="border border-gray-300 px-4 py-2">End Time</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Message</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{request.name}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {request.date
                        ? new Date(request.date).toLocaleString("default", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{request.shiftType}</td>
                    <td className="border border-gray-300 px-4 py-2">{request.startTime}</td>
                    <td className="border border-gray-300 px-4 py-2">{request.endTime}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {request.status === "pending" ? (
                        <p className="text-yellow-500">Pending</p>
                      ) : request.status === "approved" ? (
                        <p className="text-green-500">Approved</p>
                      ) : (
                        <p className="text-red-500">Rejected</p>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-justify break-words min-h-[30px] h-auto">
                      {request.userMessage}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {request.status === "rejected" ? (
                        <button
                          disabled
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                        >
                          X
                        </button>
                      ) : request.status === "approved" ? (
                        <button
                          disabled
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          O
                        </button>
                      ) : (
                        <button
                          className="bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-500"
                          onClick={() => openModal(request)}
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
  
      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        reloadRequest={() => setReload(true)}
        request={selectedRequest}
      />
    </div>
  );
  
};

export default AdminRequests;
