import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import useFetch from "../../hooks/useFetch";
import CreateRequestModal from "../userModal/CreateRequestModal";
import NavbarEmployee from "../../components/NavbarEmployee";
import { GetRequest } from "../../api/requestDB";
import { FaBuildingCircleCheck } from "react-icons/fa6";
import { FaHouseUser } from "react-icons/fa";

const RequestShift = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [requests, setRequest] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [shiftdate, setSelectedDate] = useState("");
  const [shiftID, setShiftID] = useState("");
  const [assigned, setAssigned] = useState("");
  const [reload, setReload] = useState(false);

  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;
    const shiftsForDate = events.filter(event => 
      event.start.startsWith(clickedDate) && event.extendedProps?.employees !== "None"
    );

    if (shiftsForDate.length > 0) {
      setSelectedShift(shiftsForDate);
      setSelectedDate(clickedDate);
      setShiftID(shiftsForDate[0].id);
      setAssigned(shiftsForDate[0].title);
      setIsModalOpen(true);
    } else {
      alert("No shifts scheduled for you on this date.");
    }
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (modifier === "PM" && hours !== "12") hours = String(parseInt(hours) + 12);
    if (modifier === "AM" && hours === "12") hours = "00";
    return `${hours}:${minutes}:00`;
  };

  const { data, loading, error, refetch } = useFetch(`http://localhost:4000/api/shift/`);

  useEffect(() => {
    const formattedEvents = data.map((shift) => {
      const startDateTime = new Date(`${shift.date.split("T")[0]}T${convertTo24Hour(shift.startTime)}`);
      const endDateTime = new Date(`${shift.date.split("T")[0]}T${convertTo24Hour(shift.endTime)}`);
      const requestedBy = localStorage.getItem("userId");
      const assignedEmployees = shift.assignedEmployees.filter(emp => emp._id === requestedBy).map(emp => emp.firstname);

      const shiftType = assignedEmployees.length > 0 && shift.shiftType === "on-site" ? "On-site" : "WFH";

      return {
        id: shift._id,
        title: shiftType,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        color: shift.shiftType === "on-site" && assignedEmployees.length > 0 ? "green" : "gray",
        allDay: true,
        extendedProps: { employees: assignedEmployees, shiftType: shift.shiftType },
      };
    });
    setEvents(formattedEvents);
  }, [data]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRequest = async () => {
      setisLoading(true);
      try {
        const request = await GetRequest(userId);
        console.log("Fetched Request:", request);
        setRequest(Array.isArray(request) ? request : [request]);
      } catch (error) {
        console.log("Error fetching request:", error);
      } finally {
        setisLoading(false);
        setReload(false);
      }
    };

    fetchRequest(); // Call function on mount
  }, [reload]); // Empty dependency array means it runs once when mounted

  const renderEventContent = (eventInfo) => {
    const icon = eventInfo.event.extendedProps.shiftType === "on-site" ? <FaBuildingCircleCheck /> : <FaHouseUser />;
    return (
      <div>
        {icon}
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row max-h-full bg-gray-100">
      {/* Sidebar */}
      <NavbarEmployee isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-3 overflow-auto">
        {/* Page Title */}
        <h3 className="text-2xl text-center font-semibold mb-2">
          Schedule for {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
        </h3>

        {/* Request & Calendar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Request Section */}
          <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-1 ">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Requests</h2>
            {isLoading ? (
              <p className="text-gray-500">Loading requests...</p>
            ) : requests.length > 0 ? (
              <ul className="space-y-2">
                {requests.map((request, index) => (
                  <li
                    key={index}
                    className="bg-gray-50 p-2 rounded-lg border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {new Date(request.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      {request.shiftType === "on-site" ? " (On-Site)" : " (Remote)"}
                    </h3>
                    {request.status === "approved" ? (
                      <p className="text-green-600 mb-1 font-semibold">
                        Approved
                      </p>
                    ) : request.status === "pending" ? (
                      <p className="text-yellow-400 mb-1 font-semibold">
                        Pending
                      </p>
                    ) : request.status === "rejected" ? (
                      <p className="text-red-600 mb-1 font-semibold">
                        Rejected
                      </p>
                    ) : (
                      <p className="text-gray-600 mb-1">No status available.</p>
                    )}
                    <p className="text-gray-600 mb-1">
                      {request.adminMessage || "No message available."}
                    </p>
                    <span className="text-sm text-gray-500 block">
                      Requested on: {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No request.</p>
            )}
          </div>

          {/* Calendar Section (2/3 width) */}
          <div className="bg-white shadow-lg rounded-lg p-3 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Calendar</h2>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{ left: "prev,next", center: "title", right: "" }}
              height="auto"
              contentHeight="auto"
              handleWindowResize={true}
              aspectRatio={2}
              selectable={true}
              editable={true}
              slotMinTime="07:30:00"
              slotMaxTime="20:00:00"
              dateClick={handleDateClick}
              events={events}
              eventContent={renderEventContent} // Use the custom event content
              eventClick={false}
            />
          </div>
        </div>

        <CreateRequestModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          shifts={assigned} 
          shiftId={shiftID}
          shiftDate={shiftdate}
          requestAdded={() => setReload(true)}
        />
      </div>
    </div>
  );
};

export default RequestShift;