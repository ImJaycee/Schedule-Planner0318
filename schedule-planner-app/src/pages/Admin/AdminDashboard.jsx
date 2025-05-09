import React, { useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // For click & drag events
import timeGridPlugin from "@fullcalendar/timegrid"; // For week/day views
import listPlugin from "@fullcalendar/list"; // For list vie
import useFetch from "../../hooks/useFetch";
import Modal from "../adminModals/shiftModal";
import NavbarAdmin from "../../components/NavbarAdmin";
import convertTo24Hour from "../../utils/utils";

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;
    const shiftsForDate = events
      .filter((event) => event.start.startsWith(clickedDate))
      .map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        employees: event.extendedProps?.employees || "None",
        shiftType: event.extendedProps?.shiftType || "night", // Ensure shiftType is set
        color: event.extendedProps?.shiftType === "on-site" ? "green" : "red", // Assign color correctly
      }));

    if (shiftsForDate.length > 0) {
      setSelectedShift(shiftsForDate);
      setIsModalOpen(true);
    } else {
      alert("No shifts scheduled on this date.");
    }
  };

  const { data } = useFetch("http://localhost:4000/api/shift/");
  const [events, setEvents] = useState([]);

  // Transform fetched data to FullCalendar format
  useEffect(() => {
    const formattedEvents = data.map((shift) => {
      // Convert Date String + Time String to ISO DateTime
      const startDateTime = new Date(
        `${shift.date.split("T")[0]}T${convertTo24Hour(shift.startTime)}`
      );
      const endDateTime = new Date(
        `${shift.date.split("T")[0]}T${convertTo24Hour(shift.endTime)}`
      );

      const employee = shift.assignedEmployees
        .map((emp) => emp.firstname)
        .join(", ");
      return {
        id: shift._id,
        title: "",
        start: startDateTime.toISOString(), // Ensure proper format
        end: endDateTime.toISOString(),
        color: shift.shiftType === "on-site" ? "green" : "red",
        allDay: true,
        extendedProps: {
          employees: employee,
          shiftType: shift.shiftType,
        },
      };
    });

    setEvents(formattedEvents);
  }, [data]);

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <NavbarAdmin
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className='flex-1 p-4'>
        {/* Page Title */}
        <h3 className='text-xl text-center font-semibold mb-4'>
          Schedule for{" "}
          {new Date().toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        {/* Calendar Container */}
        <div className='flex justify-center mx-auto'>
          <div className='w-full max-w-6xl bg-white shadow-lg p-4 rounded-lg overflow-x-auto'>
            <FullCalendar
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              initialView='dayGridMonth'
              headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "",
              }}
              height='auto'
              contentHeight='auto'
              handleWindowResize={true}
              aspectRatio={1.5}
              selectable={true}
              editable={true}
              slotMinTime='07:30:00'
              slotMaxTime='20:00:00'
              dateClick={handleDateClick}
              events={events}
              eventClick={false}
            />
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              shifts={selectedShift}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
