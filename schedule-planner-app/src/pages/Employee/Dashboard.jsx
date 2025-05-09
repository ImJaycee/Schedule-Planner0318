import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // For click & drag events
import timeGridPlugin from "@fullcalendar/timegrid"; // For week/day views
import listPlugin from "@fullcalendar/list"; // For list view

import useFetch from "../../hooks/useFetch";
import UserShiftModal from "../userModal/shiftModal";
import NavbarEmployee from "../../components/NavbarEmployee";
import { GetAnnouncement } from "../../api/announcemet";

const Dashboard = () => {
  const { user, dispatch } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(""); // State for selected department

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasSchedule, setHasSchedule] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;

    // Get only shifts where the user is assigned
    const shiftsForDate = filteredEvents
      .filter(
        (event) =>
          event.start.startsWith(clickedDate) &&
          event.extendedProps?.employees !== "None"
      )
      .map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        employees: event.extendedProps?.employees || "None",
        shiftType: event.extendedProps?.shiftType || "wfh", // Ensure shiftType is set
        color: event.extendedProps?.shiftType === "on-site" ? "green" : "red", // Assign color correctly
      }));

    if (shiftsForDate.length > 0) {
      setSelectedShift(shiftsForDate);
      setIsModalOpen(true);
    } else {
      alert("No shifts scheduled for you on this date.");
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

  const { data } = useFetch(`http://localhost:4000/api/shift/`);

  // Transform fetched data to FullCalendar format
  useEffect(() => {
    let userHasSchedule = false;
    const userID = localStorage.getItem("userId");

    const formattedEvents = data.map((shift) => {
      const startDateTime = new Date(
        `${shift.date.split("T")[0]}T${convertTo24Hour(shift.startTime)}`
      );
      const endDateTime = new Date(
        `${shift.date.split("T")[0]}T${convertTo24Hour(shift.endTime)}`
      );

      const assignedNames = shift.assignedEmployees
        .map((emp) => emp.firstname)
        .join(", ");
      const isUserAssigned = shift.assignedEmployees.some(
        (emp) => emp._id === userID
      );

      if (isUserAssigned) {
        userHasSchedule = true;
      }

      return {
        id: shift._id,
        title: "",
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        color: isUserAssigned
          ? shift.shiftType === "on-site"
            ? "green"
            : "red"
          : "gray", // WFH shifts = red
        allDay: true,
        extendedProps: {
          employees: assignedNames,
          shiftType: shift.shiftType,
          department: shift.department,
          isUserAssigned,
        },
      };
    });

    setHasSchedule(userHasSchedule);
    setEvents(formattedEvents);
    setFilteredEvents(formattedEvents);
  }, [data]);

  // Filter events based on selected department
  useEffect(() => {
    if (selectedDepartment) {
      const filtered = events.filter(
        (event) => event.extendedProps.department === selectedDepartment
      );

      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [selectedDepartment, events]);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      setIsLoading(true);
      try {
        const announcement = await GetAnnouncement();

        setAnnouncements(announcement); // Limit to 4 announcements
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncement(); // Call function on mount
  }, []); // Empty dependency array means it runs once when mounted

  return (
    <div className='flex flex-col md:flex-row max-h-screen bg-gray-100'>
      {/* Sidebar */}
      <NavbarEmployee
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className=' flex flex-col px-1 pt-3 pb-10 md:pt-5 overflow-y-auto'>
        {/* Announcements & Calendar Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Announcements Section */}
          <div className='bg-white shadow-lg rounded-lg p-4 lg:col-span-1 order-2 lg:order-1'>
            <h2 className='text-xl font-semibold text-gray-700 text-center mb-4'>
              Announcements
            </h2>
            {isLoading ? (
              <p className='text-gray-500 text-center'>
                Loading announcements...
              </p>
            ) : announcements.length > 0 ? (
              <ul className='grid gap-4 max-h-[550px] overflow-y-auto'>
                {announcements.map((announcement, index) => (
                  <li
                    key={index}
                    className='bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 shadow hover:shadow-md transition-shadow'
                  >
                    <h3 className='text-lg font-bold text-gray-800 mb-1'>
                      {announcement.title || "Untitled"}
                    </h3>
                    <p className='text-gray-600 mb-2'>
                      {announcement.content || "No message available."}
                    </p>
                    <span className='text-sm text-gray-500 block'>
                      Posted on:{" "}
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-gray-500 text-center'>
                No announcements available.
              </p>
            )}
          </div>

          {/* Calendar Section */}
          <div className='bg-white shadow-lg rounded-lg p-4 lg:col-span-2 order-1 lg:order-2 relative'>
            {/* Filter Dropdown */}
            <div className='flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2 sm:gap-4 mb-3'>
              <label className='text-sm font-medium text-gray-700'>
                Filter by Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className='p-2 border rounded w-full sm:w-auto'
              >
                <option value=''>All Departments</option>
                <option value='Technical'>Technical</option>
                <option value='IT Support'>IT Support</option>
                <option value='Sales & Marketing'>Sales & Marketing</option>
                <option value='Research'>Research</option>
              </select>
            </div>

            <h2 className='text-xl font-semibold text-center text-gray-700 mb-4'>
              Schedule for{" "}
              {new Date().toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>

            <FullCalendar
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              initialView='dayGridMonth'
              headerToolbar={{ left: "prev,next", center: "title", right: "" }}
              height='auto'
              contentHeight='auto'
              handleWindowResize={true}
              aspectRatio={1.5}
              selectable={true}
              editable={true}
              slotMinTime='07:30:00'
              slotMaxTime='20:00:00'
              dateClick={handleDateClick}
              events={filteredEvents}
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
