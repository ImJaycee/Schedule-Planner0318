import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // For click & drag events
import timeGridPlugin from "@fullcalendar/timegrid"; // For week/day views
import listPlugin from "@fullcalendar/list"; // For list vie
import useFetch from "../../hooks/useFetch";
import Modal from "../adminModals/shiftModal";
import NavbarAdmin from "../../components/NavbarAdmin"

const AdminDashboard = () => {
  const { user, dispatch } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);



  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;
    const shiftsForDate = events
      .filter(event => event.start.startsWith(clickedDate))
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
      alert("No shifts scheduled on this date.");
    }
};

  

// const handleEventClick = (info) => {
//   setSelectedShift([{
//     id: info.event.id,
//     title: info.event.title,
//     start: info.event.start,
//     end: info.event.end,
//     employees: info.event.extendedProps?.employees || "None",
//     shiftType: info.event.extendedProps?.shiftType || "night", // Ensure shiftType is set
//     color: info.event.extendedProps?.shiftType === "morning" ? "green" : "red" // Assign color correctly
//   }]);
//   setIsModalOpen(true);
// };

  

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

  const {data, loading, error} = useFetch("http://localhost:4000/api/shift/")
  const [events, setEvents] = useState([]);

  // Transform fetched data to FullCalendar format
  useEffect(() => {
    console.log(data)
    const formattedEvents = data.map((shift) => {
      // Convert Date String + Time String to ISO DateTime
      const startDateTime = new Date(`${shift.date.split("T")[0]}T${convertTo24Hour(shift.startTime)}`);
      const endDateTime = new Date(`${shift.date.split("T")[0]}T${convertTo24Hour(shift.endTime)}`);
    
      return {
        id: shift._id,
        title: "View Schedule",
        start: startDateTime.toISOString(), // Ensure proper format
        end: endDateTime.toISOString(),
        color: shift.shiftType === "morning" ? "green" : "red",
        allDay: true,
        extendedProps: {
          employees: shift.assignedEmployees.map(emp => emp.firstname).join(", "),
          shiftType: shift.shiftType,
        },
      };
    });
    
    setEvents(formattedEvents);
    
  }, [data]);





  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <NavbarAdmin isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 overflow-auto">
        {/* Page Title */}
        <h3 className="text-xl text-center font-semibold mb-4">
          Schedule for {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
        </h3>

        {/* Calendar Container */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl bg-white shadow-lg p-4 rounded-lg">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              height="600px"
              contentHeight="auto"
              handleWindowResize={true}
              aspectRatio={1.5}
              selectable={true}
              editable={true}
              slotMinTime="07:30:00"
              slotMaxTime="20:00:00"
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
