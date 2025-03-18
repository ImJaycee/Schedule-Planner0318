
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // For click & drag events
import timeGridPlugin from "@fullcalendar/timegrid"; // For week/day views
import listPlugin from "@fullcalendar/list"; // For list vie

import useFetch from "../../hooks/useFetch";
import UserShiftModal from "../userModal/shiftModal";
import NavbarEmployee from "../../components/NavbarEmployee"
import { GetAnnouncement } from "../../api/announcemet";

const Dashboard = () => {
  const { user, dispatch } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasSchedule, setHasSchedule] = useState(false);
  const [announcements, setAnnouncement] = useState([]);

  const [isLoading, setisLoading] = useState(false);




  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;
    
    // Get only shifts where the user is assigned
    const shiftsForDate = events
      .filter(event => event.start.startsWith(clickedDate) && event.extendedProps?.employees !== "None")
      .map(event => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        employees: event.extendedProps?.employees || "None",
        shiftType: event.extendedProps?.shiftType || "night", // Ensure shiftType is set
        color: event.extendedProps?.shiftType === "morning" ? "green" : "red" // Assign color correctly
      }));

    if (shiftsForDate.length > 0) {
      setSelectedShift(shiftsForDate);
      setIsModalOpen(true);
    } else {
      alert("No shifts scheduled for you on this date.");
    }
};


const handleAnnouncement = async (e) => {
  e.preventDefault();

  try {
    setisLoading(true);
      const announcement = await GetAnnouncement();
      console.log("Fetched Announcement:", announcement);
  } catch (error) {
      console.log("Error:", error);
  } finally {
    setisLoading(false);
  }
};


  

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
  
    if (modifier === "PM" && hours !== "12") {
      hours = String(parseInt(hours) + 12);
    } else if (modifier === "AM" && hours === "12") {
      hours = "00";
    }
  
    return `${hours}:${minutes}:00`; // Ensure seconds are included
  };

  const {data, loading, error} = useFetch(`http://localhost:4000/api/shift/`)


  // Transform fetched data to FullCalendar format
  useEffect(() => {
    let userHasSchedule = false; 
  
    const formattedEvents = data.map((shift) => {
      // Convert Date String + Time String to ISO DateTime
      const startDateTime = new Date(`${shift.date.split("T")[0]}T${convertTo24Hour(shift.startTime)}`);
      const endDateTime = new Date(`${shift.date.split("T")[0]}T${convertTo24Hour(shift.endTime)}`);
  
      const userID = localStorage.getItem("userId");
  
      // Check if the user is assigned to this shift
      const checkUser = shift.assignedEmployees
        .filter(emp => emp._id === userID) // Filter employees with matching userID
        .map(emp => emp.firstname);
  
      // If user is assigned, set flag to true
      if (checkUser.length > 0) {
        userHasSchedule = true;
        return {
          id: shift._id,
          title: "",
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
          color: shift.shiftType === "morning" ? "green" : "red",
          allDay: true,
          extendedProps: {
            employees: checkUser,
            shiftType: shift.shiftType,
          },
        };
      }
  
      // If user is NOT assigned, return an empty event with gray color
      return {
        id: shift._id,
        title: "",
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        color: "gray",
        allDay: true,
        extendedProps: {
          employees: "",
          shiftType: "morning",
        },
      };
    });
  
    // Update state based on whether the user has a schedule
    setHasSchedule(userHasSchedule);
  
    setEvents(formattedEvents);
  }, [data]);
  


  useEffect(() => {
    const fetchAnnouncement = async () => {
      setisLoading(true);
      try {
        const announcement = await GetAnnouncement();
        console.log("Fetched Announcement:", announcement);
        setAnnouncement(announcement);
      } catch (error) {
        console.log("Error fetching announcement:", error);
      } finally {
        setisLoading(false);
      }
    };

    fetchAnnouncement(); // Call function on mount
  }, []); // Empty dependency array means it runs once when mounted

  





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

          {/* Announcements & Calendar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Announcements Section */}
            <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-1">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Announcements</h2>
              {isLoading ? (
                <p className="text-gray-500">Loading announcements...</p>
              ) : announcements.length > 0 ? (
                <ul className="space-y-4">
                  {announcements.map((announcement, index) => (
                    <li
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {announcement.title || "Untitled"}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {announcement.content || "No message available."}
                      </p>
                      <span className="text-sm text-gray-500 block">
                        Posted on: {new Date(announcement.createdAt).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No announcements available.</p>
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
                eventClick={false}
              />
            </div>
          </div>

          {/* User Shift Modal */}
          <UserShiftModal
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            shifts={selectedShift} 
          />
        </div>
      </div>

  );
};

export default Dashboard;
