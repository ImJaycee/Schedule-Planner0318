import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import NavbarEmployee from "../../components/NavbarEmployee";
import useFetch from "../../hooks/useFetch";
import {
  AcceptRequest,
  CreateShiftSwapRequest,
  DeclineRequest,
  GetReceivedSwapRequest,
  GetSendSwapRequest,
} from "../../api/requestSwap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RequestShiftSwap = () => {
  const { user } = useContext(AuthContext);
  const [searchDate, setSearchDate] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [offerDate, setOfferDate] = useState("");
  const [employees, setEmployees] = useState([]);
  const [onSiteEmployees, setOnSiteEmployees] = useState([]);
  const [wfhEmployees, setWfhEmployees] = useState([]);
  const [selectedShiftType, setSelectedShiftType] = useState("");
  const [OfferDateErr, setOfferError] = useState("");
  const [ReqDateErr, setReqError] = useState("");
  const [EmployeeOnSite, setEmployeeOnsite] = useState("");
  const [EmployeeWFH, setEmployeeWFH] = useState("");
  const [userAssignedShift, setAssignedShift] = useState("");
  const [shiftID, setShiftId] = useState("");
  const [RequesterMessage, setReqMessage] = useState("");
  const [RequestFor, setRequestFor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requesterShift, setRequesterShiftId] = useState(false);
  const [requests, setRequest] = useState([]);
  const [requestedToUser, setRequestToUser] = useState([]);
  const [reload, setReload] = useState(false);
  const [loadingRequestId, setLoadingRequestId] = useState(null);
  const department = localStorage.getItem("department");
  const [viewMode, setViewMode] = useState("sent");

  const [formData, setFormData] = useState({
    date: "",
    RecipientST: "",
    RequesterST: "",
    requestedBy: "",
    requestedTo: "",
    requesterName: "",
    requestingShiftId: "",
    requesterShiftId: "",
    RequesterMessage: "",
  });
  const [recipientMessage, setRecipientMessage] = useState("");

  const navigate = useNavigate();

  const { data: shifts } = useFetch(`http://localhost:4000/api/shift/`);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/request-shift/get-user/all/${department}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (!shifts || shifts.length === 0 || employees.length === 0 || !searchDate)
      return;

    setIsLoading(true);
    const formattedSearchDate = new Date(searchDate)
      .toISOString()
      .split("T")[0];
    const filteredShifts = shifts.filter(
      (shift) =>
        new Date(shift.date).toISOString().split("T")[0] === formattedSearchDate
    );

    if (filteredShifts.length > 0) {
      setShiftId(filteredShifts[0]._id); // Get the first shift's ID
      setFormData({
        requestingShiftId: filteredShifts[0]._id,
      }); // Get the first shift's ID
    } else {
      setShiftId(null); // Reset if no shift is found
    }
    setIsLoading(false);

    const assignedEmployeeIds = new Set(
      filteredShifts.flatMap((shift) =>
        shift.assignedEmployees.map((emp) => emp._id)
      )
    );

    const currentDepartment = localStorage.getItem("department");
    const currentUserId = localStorage.getItem("userId");

    // Filter assigned employees (on-site) by department
    let filteredOnSite = employees.filter(
      (emp) =>
        assignedEmployeeIds.has(emp._id) && emp.department === currentDepartment
    );

    // Filter WFH employees by department
    let filteredWfh = employees.filter(
      (emp) =>
        !assignedEmployeeIds.has(emp._id) &&
        emp.department === currentDepartment
    );

    setReqError("");
    setEmployeeOnsite("");
    setEmployeeWFH("");
    // If current user is in WFH, exclude them from the WFH list
    if (filteredWfh.some((emp) => emp._id === currentUserId)) {
      filteredWfh = [];
    }
    if (filteredOnSite.some((emp) => emp._id === currentUserId)) {
      filteredOnSite = [];
    }

    if (filteredWfh.length === 0) {
      setEmployeeWFH(
        "You are assigned to WFH. You cannot select anyone from this list."
      );
    }

    if (filteredOnSite.length === 0) {
      setEmployeeOnsite(
        "You are assigned to on-site. You cannot select anyone from this list."
      );
    }

    if (filteredWfh.length === 0 && filteredOnSite.length === 0) {
      setReqError("No schedule for selected Date");
      setEmployeeOnsite("");
      setEmployeeWFH("");
    }

    // Set state
    setOnSiteEmployees(filteredOnSite);
    setWfhEmployees(filteredWfh);
  }, [searchDate, shifts, employees]);

  useEffect(() => {
    if (!offerDate) return;

    const userID = localStorage.getItem("userId");
    const formattedSearchDate = new Date(offerDate).toISOString().split("T")[0];

    const filteredShifts = shifts.filter(
      (shift) =>
        new Date(shift.date).toISOString().split("T")[0] === formattedSearchDate
    );

    if (filteredShifts.length > 0) {
      setRequesterShiftId(filteredShifts[0]._id);
    } else {
      setOfferError("No schedule on selected offer date");

      setAssignedShift("");
      return;
    }

    const userAssigned = filteredShifts.some((shift) =>
      shift.assignedEmployees.some((emp) => emp._id === userID)
    );

    setAssignedShift(userAssigned ? "on-site" : "wfh");
    setOfferError("");
  }, [offerDate, shifts]);

  // NEW useEffect to ensure formData updates after userAssignedShift is set
  useEffect(() => {
    const userID = localStorage.getItem("userId");
    const userTemp = JSON.parse(localStorage.getItem("userTemp")) || {};

    setFormData((prev) => ({
      ...prev,
      date: offerDate || "",
      RecipientST: selectedShiftType || "",
      RequesterST: userAssignedShift || "", // Now updates correctly
      requestedBy: userID || "",
      requestedTo: selectedEmployee || "",
      requesterName: `${userTemp.firstname || "Unknown"} ${
        userTemp.lastname || "Unknown"
      }`,
      requestingShiftId: shiftID ? shiftID.toString() : "",
      requesterShiftId: requesterShift ? requesterShift.toString() : "",
      requesterMessage: RequesterMessage || "",
    }));
  }, [
    userAssignedShift,
    selectedShiftType,
    selectedEmployee,
    offerDate,
    shiftID,
    RequesterMessage,
    requesterShift,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || !offerDate || !selectedShiftType || OfferDateErr)
      return;

    const result = await Swal.fire({
      title: `Confirm Swap Request`,
      text: `Are you sure you want to send request to ${RequestFor}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3d3",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, send it!",
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true); // Start loading
        await CreateShiftSwapRequest(formData);
        Swal.fire("Success!", "The shift request has been sent.", "success");
        navigate("/homepage");
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.message || "An error occurred",
          "error"
        );
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      requesterMessage: RequesterMessage,
    }));
  }, [RequesterMessage]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRequest = async () => {
      setIsLoading(true);
      try {
        const request = await GetSendSwapRequest(userId);

        request.forEach((req, index) => {});
        setRequest(request);
      } catch (error) {
      } finally {
        setIsLoading(false);
        setIsLoading(false);
      }
    };

    const fetchinComingRequest = async () => {
      setIsLoading(true);
      try {
        const Receivedrequest = await GetReceivedSwapRequest(userId);

        Receivedrequest.forEach((req, index) => {});
        setRequestToUser(Receivedrequest);
      } catch (error) {
      } finally {
        setIsLoading(false);
        setIsLoading(false);
      }
    };

    fetchRequest(); // Call function on mount
    fetchinComingRequest();
    setReload(false);
  }, [reload]);

  const handleAccept = async (event) => {
    event.preventDefault();
    const requestSwapId = event.target.requestSwapId.value;

    const AcceptformData = {
      requestSwapId: requestSwapId,
      recipientMessage,
    };

    try {
      setLoadingRequestId(requestSwapId); // Start loading for this request
      const accept = await AcceptRequest(AcceptformData);
      if (accept) {
        toast.success("Request Accepted successfully");
        setReload(true);
        navigate("/request-shift-swap");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoadingRequestId(null); // Stop loading
    }
  };

  const handleDecline = async (event, requestSwapId) => {
    event.preventDefault();

    const DeclineformData = {
      requestSwapId,
      recipientMessage,
    };

    try {
      setLoadingRequestId(requestSwapId); // Start loading for this request
      const decline = await DeclineRequest(DeclineformData);
      if (decline) {
        toast.success("Request declined successfully");
        setReload(true);
        navigate("/request-shift-swap");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoadingRequestId(null); // Stop loading
    }
  };

  return (
    <div className='flex flex-col md:flex-row max-h-full bg-gray-100 min-h-screen h-screen'>
      <NavbarEmployee />
      <div className='flex-1 flex flex-col p-3 overflow-auto'>
        <div>
          <h3 className='text-2xl text-center font-semibold mb-6 mt-5'>
            Shift Swap Requests
          </h3>{" "}
          {/* Added mb-4 */}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Left Side - Send Request */}
          <div className='bg-white shadow-lg rounded-lg p-6'>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>
              Request Shift Swap
            </h2>

            <form onSubmit={handleSubmit} className='w-full'>
              <label className='block font-semibold text-gray-800'>
                Select Date
              </label>
              <input
                type='date'
                className='p-2 border rounded w-full mb-2'
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
              <label className='block font-semibold text-red-800'>
                {ReqDateErr}{" "}
              </label>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                    On-site Employees
                  </h3>
                  <label className='block font-semibold text-green-800'>
                    {EmployeeOnSite}{" "}
                  </label>
                  {onSiteEmployees.map((emp) => (
                    <label
                      key={emp._id}
                      className='flex items-center space-x-3 p-2 border rounded mb-1 bg-white shadow'
                    >
                      <input
                        disabled={emp._id === localStorage.getItem("userId")}
                        type='radio'
                        name='selectedEmployee'
                        value={emp._id}
                        className='form-radio h-5 w-5 text-blue-500'
                        onChange={() => {
                          setSelectedEmployee(emp._id);
                          setSelectedShiftType("on-site");
                          setRequestFor(emp.firstname);
                        }}
                      />
                      <span className='text-gray-700'>{emp.firstname}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                    Work From Home Employees
                  </h3>
                  <label className='block font-semibold text-green-800'>
                    {EmployeeWFH}{" "}
                  </label>
                  {wfhEmployees.map((emp) => (
                    <label
                      key={emp._id}
                      className='flex items-center space-x-3 p-2 border rounded mb-1 bg-white shadow'
                    >
                      <input
                        disabled={emp._id === localStorage.getItem("userId")}
                        type='radio'
                        name='selectedEmployee'
                        value={emp._id}
                        className='form-radio h-5 w-5 text-blue-500'
                        onChange={() => {
                          setSelectedEmployee(emp._id);
                          setSelectedShiftType("wfh");
                          setRequestFor(emp.firstname);
                        }}
                      />
                      <span className='text-gray-700'>{emp.firstname}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className='mt-4'>
                <label className='block font-semibold text-gray-800'>
                  Your Offering Date:
                </label>
                <input
                  required
                  type='date'
                  className='p-2 border rounded w-full'
                  value={offerDate}
                  onChange={(e) => setOfferDate(e.target.value)}
                />
              </div>
              <label className='block font-semibold text-green-800'>
                {userAssignedShift}
              </label>

              <div className='mt-4'>
                <label className='block font-semibold text-gray-800'>
                  Message
                </label>
                <input
                  type='text'
                  className='p-2 border rounded w-full'
                  value={RequesterMessage}
                  name='RequesterMessage'
                  onChange={(e) => setReqMessage(e.target.value)}
                />
              </div>

              <label className='block font-semibold text-red-800'>
                {OfferDateErr}{" "}
              </label>

              <button
                type='submit'
                className={`mt-4 px-4 py-2 rounded text-white w-full sm:w-auto ${
                  selectedEmployee &&
                  offerDate &&
                  selectedShiftType &&
                  !OfferDateErr &&
                  !isLoading
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={
                  !selectedEmployee ||
                  !offerDate ||
                  !selectedShiftType ||
                  OfferDateErr ||
                  isLoading
                }
              >
                {isLoading ? (
                  <span className='flex items-center'>
                    <svg
                      className='animate-spin h-5 w-5 mr-2 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8v8H4z'
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Request Swap"
                )}
              </button>
            </form>
          </div>

          {/* Right Side - View Requests */}
          <div className='bg-white shadow-lg rounded-lg p-6'>
            {/* Buttons to toggle between sent and received requests */}
            <div className='flex justify-center mb-4'>
              <button
                className={`px-4 py-2 rounded-l-md ${
                  viewMode === "received"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setViewMode("received")}
              >
                View Received Requests
              </button>
              <button
                className={`px-4 py-2 rounded-r-md ${
                  viewMode === "sent"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setViewMode("sent")}
              >
                View Sent Requests
              </button>
            </div>

            {/* Conditional rendering based on viewMode */}
            {viewMode === "sent" ? (
              <div>
                <h3 className='text-md font-semibold text-gray-800'>
                  Sent Requests
                </h3>
                {isLoading ? (
                  <p className='text-gray-500'>Loading requests...</p>
                ) : requests.length > 0 ? (
                  <ul className='space-y-2 max-h-160 overflow-y-auto'>
                    {" "}
                    {/* Adjusted height */}
                    {requests.map((request, index) => (
                      <li
                        key={index}
                        className='bg-gray-50 p-2 rounded-lg border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow'
                      >
                        <p className='text-green-800 mb-1 font-semibold text-sm'>
                          Sent to {request.requestedTo?.firstname || "Unknown"}
                        </p>
                        <h3 className='text-md font-bold text-gray-800 mb-1'>
                          Your Schedule:{" "}
                          {request.date
                            ? new Date(request.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}{" "}
                          {request.RequesterST === "on-site"
                            ? " (On-Site)"
                            : " (Remote)"}
                        </h3>
                        <h3 className='text-md font-bold text-gray-800 mb-1'>
                          Requesting For:{" "}
                          {request.requestingShiftId?.date
                            ? new Date(
                                request.requestingShiftId.date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "N/A"}{" "}
                          {request.RecipientST === "on-site"
                            ? " (On-Site)"
                            : " (Remote)"}
                        </h3>
                        {request.status === "approved" ? (
                          <p className='text-green-600 mb-1 font-semibold text-sm'>
                            Approved
                          </p>
                        ) : request.status === "pending" &&
                          request.recipientStatus === "accepted" ? (
                          <p className='text-yellow-600 mb-1 font-semibold text-sm'>
                            Pending - admin approval
                          </p>
                        ) : request.status === "pending" &&
                          request.recipientStatus === "pending" ? (
                          <p className='text-yellow-400 mb-1 font-semibold text-sm'>
                            Pending - waiting for{" "}
                            {request.requestedTo?.firstname || "Unknown"} to
                            accept
                          </p>
                        ) : request.status === "rejected" ? (
                          <p className='text-red-600 mb-1 font-semibold text-sm'>
                            Rejected
                          </p>
                        ) : (
                          <p className='text-gray-600 mb-1'>
                            No status available.
                          </p>
                        )}
                        <p className='text-gray-600 mb-1'>
                          <span className='text-gray-900'>Admin</span> -{" "}
                          {request.adminMessage || "No message available."}
                        </p>
                        <p className='text-gray-600 mb-1'>
                          <span className='text-gray-900'>
                            {request.requestedTo?.firstname || "Unknown"}
                          </span>{" "}
                          -{" "}
                          {request.recipientMessage || "No message available."}
                        </p>
                        <span className='text-sm text-gray-500 block'>
                          Requested on:{" "}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='text-gray-500'>No sent requests.</p>
                )}
              </div>
            ) : (
              <div>
                <h3 className='text-lg font-semibold text-gray-800'>
                  Received Requests
                </h3>
                {isLoading ? (
                  <p className='text-gray-500'>Loading requests...</p>
                ) : requestedToUser.length > 0 ? (
                  <ul className='space-y-2 max-h-160 overflow-y-auto'>
                    {" "}
                    {/* Adjusted height to fit 3 items */}
                    {requestedToUser.map((request, index) => (
                      <li
                        key={index}
                        className='bg-gray-50 p-2 rounded-lg border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow'
                      >
                        <p className='text-green-800 mb-1 font-semibold text-sm'>
                          Request from{" "}
                          {request.requestedBy?.firstname || "Unknown"}
                        </p>
                        <h3 className='text-md font-bold text-gray-800 mb-1'>
                          Your Schedule:{" "}
                          {request.requestingShiftId?.date
                            ? new Date(
                                request.requestingShiftId.date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "N/A"}{" "}
                          {request.RecipientST === "on-site"
                            ? " (On-Site)"
                            : " (Remote)"}
                        </h3>
                        <h3 className='text-md font-bold text-gray-800 mb-1'>
                          Sender Schedule:{" "}
                          {request.requesterShiftId?.date
                            ? new Date(
                                request.requesterShiftId.date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "N/A"}{" "}
                          {request.RequesterST === "on-site"
                            ? " (On-Site)"
                            : " (Remote)"}
                        </h3>
                        {request.status === "approved" ? (
                          <p className='text-green-600 mb-1 font-semibold text-sm'>
                            Approved
                          </p>
                        ) : request.status === "pending" &&
                          request.recipientStatus === "accepted" ? (
                          <p className='text-yellow-600 mb-1 font-semibold text-sm'>
                            Pending - admin approval
                          </p>
                        ) : request.status === "pending" &&
                          request.recipientStatus === "pending" ? (
                          <form
                            onSubmit={handleAccept}
                            className='bg-white p-2 rounded-md shadow-sm max-w-full mx-auto'
                          >
                            <label
                              htmlFor='recipientMessage'
                              className='block text-gray-600 text-xs font-medium mb-1'
                            >
                              Message (Optional):
                            </label>
                            <textarea
                              id='recipientMessage'
                              name='recipientMessage'
                              className='w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                              placeholder='Add a note...'
                              rows='1'
                              onChange={(e) =>
                                setRecipientMessage(e.target.value)
                              }
                            ></textarea>
                            <input
                              type='hidden'
                              name='requestSwapId'
                              value={request._id}
                              readOnly
                            />
                            <div className='flex justify-end mt-2'>
                              <button
                                type='submit'
                                className={`bg-green-600 text-white text-xs px-3 py-1 rounded-md hover:bg-green-700 transition duration-200 mr-2 ${
                                  loadingRequestId === request._id
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                disabled={loadingRequestId === request._id}
                              >
                                {loadingRequestId === request._id
                                  ? "Accepting..."
                                  : "Accept"}
                              </button>
                              <button
                                type='button'
                                onClick={(event) =>
                                  handleDecline(event, request._id)
                                }
                                className={`bg-red-500 text-white text-xs px-3 py-1 rounded-md hover:bg-red-600 transition duration-200 ${
                                  loadingRequestId === request._id
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                disabled={loadingRequestId === request._id}
                              >
                                {loadingRequestId === request._id
                                  ? "Declining..."
                                  : "Decline"}
                              </button>
                            </div>
                          </form>
                        ) : request.status === "rejected" ? (
                          <p className='text-red-600 mb-1 font-semibold text-sm'>
                            Rejected
                          </p>
                        ) : (
                          <p className='text-gray-600 mb-1'>
                            No status available.
                          </p>
                        )}
                        <p className='text-gray-600 mb-1'>
                          <span className='text-gray-900'>Admin</span> -{" "}
                          {request.adminMessage || "No message available."}
                        </p>
                        <p className='text-gray-600 mb-1'>
                          <span className='text-gray-900'>
                            {request.requestedBy?.firstname || "Unknown"}
                          </span>{" "}
                          -{" "}
                          {request.requesterMessage || "No message available."}
                        </p>
                        <span className='text-sm text-gray-500 block'>
                          Requested on:{" "}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='text-gray-500'>No received requests.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestShiftSwap;
