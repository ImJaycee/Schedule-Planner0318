import { useEffect, useState } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import { GetAllSwapRequest } from "../../api/requestSwap";
import SwapModal from "../adminModals/swapModal";
import { Check, X } from "lucide-react";

const AdminRequestsSwap = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [swapRequests, setSwapRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [reload, setReload] = useState(false);

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsRequestModalOpen(true);
  };

  useEffect(() => {
    const fetchAllRequest = async () => {
      setIsLoading(true);
      try {
        const response = await GetAllSwapRequest();

        setSwapRequests(response || []);
      } catch (error) {
      } finally {
        setIsLoading(false);
        setReload(false);
      }
    };

    fetchAllRequest();
  }, [reload]);

  const filteredRequests = swapRequests.filter((swap) => {
    return (
      (swap.requestedBy.firstname
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        swap.RecipientST?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        swap.date?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "" || swap.status === statusFilter)
    );
  });

  return (
    <div className='flex max-h-full bg-gray-100 overflow-hidden'>
      <NavbarAdmin />
      <div className='flex-1 p-6 max-h-full overflow-auto'>
        <h3 className='text-lg font-semibold mb-4'>Requests for Swap Shifts</h3>

        {/* Search and Filter */}
        <div className='flex flex-wrap gap-4 mb-4'>
          <input
            type='text'
            placeholder='Search Request...'
            className='p-2 border rounded w-full md:w-1/3'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className='p-2 border rounded w-full md:w-1/3'
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value=''>All Status</option>
            <option value='pending'>Pending</option>
            <option value='approved'>Approved</option>
            <option value='rejected'>Rejected</option>
          </select>
        </div>

        {/* Scrollable Container */}
        <div
          className={`${
            filteredRequests.length > 6
              ? "max-h-[570px] overflow-y-auto pr-2"
              : ""
          }`}
        >
          <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              filteredRequests.map((request) => (
                <li
                  key={request._id}
                  className='bg-white p-4 rounded-lg shadow-md'
                >
                  <h4 className='font-semibold'>
                    Request from: {request.requestedBy.firstname}{" "}
                    {request.requestedBy.lastname}
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Shift Type: {request.RequesterST}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Shift Date:{" "}
                    {new Date(request.requesterShiftId.date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Message: {request.requesterMessage}
                  </p>
                  <h4 className='font-semibold'>
                    Request To: {request.requestedTo.firstname}{" "}
                    {request.requestedTo.lastname}
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Shift Type: {request.RecipientST}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Shift Date:{" "}
                    {new Date(
                      request.requestingShiftId.date
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className='text-sm text-gray-800'>
                    Requested At:{" "}
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>

                  {/* Status Display */}
                  {request.status === "approved" ? (
                    <p className='text-green-600 mb-1 font-semibold text-sm'>
                      Approved
                    </p>
                  ) : request.status === "pending" &&
                    request.recipientStatus === "accepted" ? (
                    <p className='text-yellow-600 mb-1 font-semibold text-sm'>
                      Pending - Admin Approval
                    </p>
                  ) : request.status === "pending" &&
                    request.recipientStatus === "pending" ? (
                    <>
                      <p className='text-yellow-400 mb-1 font-semibold text-sm'>
                        Pending - Waiting for {request.requestedTo.firstname} to
                        accept...
                      </p>
                      <p className='text-sm text-gray-600'>
                        Message: {request.requesterMessage}
                      </p>
                      <h4 className='font-semibold'>
                        Request To: {request.requestedTo.firstname}{" "}
                        {request.requestedTo.lastname}
                      </h4>
                      <p className='text-sm text-gray-600'>
                        Shift Type: {request.RecipientST}
                      </p>
                      <p className='text-sm text-gray-600'>
                        Shift Date:{" "}
                        {new Date(
                          request.requestingShiftId.date
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className='text-sm text-gray-800'>
                        Requested At:{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </>
                  ) : request.status === "rejected" ? (
                    <p className='text-red-600 mb-1 font-semibold text-sm'>
                      Rejected
                    </p>
                  ) : null}

                  {/* Status Display */}
                  {request.status === "approved" ? (
                    <p className='text-green-600 mb-1 font-semibold text-sm'>
                      Approved
                    </p>
                  ) : request.status === "pending" &&
                    request.recipientStatus === "accepted" ? (
                    <p className='text-yellow-600 mb-1 font-semibold text-sm'>
                      Pending - Admin Approval
                    </p>
                  ) : request.status === "pending" &&
                    request.recipientStatus === "pending" ? (
                    <p className='text-yellow-400 mb-1 font-semibold text-sm'>
                      Pending - Waiting for {request.requestedTo.firstname} to
                      accept...
                    </p>
                  ) : request.status === "rejected" ? (
                    <p className='text-red-600 mb-1 font-semibold text-sm'>
                      Rejected
                    </p>
                  ) : null}

                  {/* Actions */}
                  <div className='mt-2'>
                    {request.recipientStatus === "pending" ? (
                      <button
                        className='bg-gray-400 text-white px-3 py-1 rounded cursor-not-allowed'
                        disabled
                      >
                        Waiting for Recipient
                      </button>
                    ) : request.recipientStatus === "rejected" ||
                      request.status === "rejected" ? (
                      <button
                        className='bg-red-500 text-white px-3 py-1 rounded'
                        disabled
                      >
                        Request Rejected
                        <X size={16} />
                      </button>
                    ) : request.status === "approved" ? (
                      <button
                        className='bg-green-500 text-white px-3 py-1 rounded'
                        disabled
                      >
                        Request Approved
                        <Check size={15} />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => openModal(request)}
                          className='bg-green-500 text-white px-3 py-1 rounded mr-2'
                        >
                          View
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <SwapModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        reloadRequest={() => setReload(true)}
        request={selectedRequest}
      />
    </div>
  );
};

export default AdminRequestsSwap;
