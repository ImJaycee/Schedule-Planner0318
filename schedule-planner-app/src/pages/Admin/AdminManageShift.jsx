
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
import CreateShiftModal from "../adminModals/CreateShiftModal";
import UpdateShiftModal from "../adminModals/UpdateShiftModal";
import NavbarAdmin from "../../components/NavbarAdmin"



const AdminManageShift = () => {
  const { user, dispatch } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [shiftID, setShiftId] = useState("");



  const handleDateClick = (info) => {
    const clickedDate = info.dateStr; // Format: "YYYY-MM-DD"
    
    const shiftsForDate = events
      .filter(event => {
        const eventDate = event.start.split("T")[0]; // Extract "YYYY-MM-DD"
        return eventDate === clickedDate;
      })
      .map(event => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        employees: event.extendedProps?.employees || "None",
        userId: event.extendedProps?.userId || "None",
        shiftType: event.extendedProps?.shiftType || "night",
        color: event.extendedProps?.shiftType === "morning" ? "green" : "red",
      }));

    setSelectedDate(clickedDate);

    if (shiftsForDate.length > 0) {
      const shiftID = shiftsForDate[0].id;
      setShiftId(shiftID);
      setSelectedShift(clickedDate);
      setIsUpdateModalOpen(true);
    } else {
      setSelectedDate(clickedDate);
      setIsCreateModalOpen(true);
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

  const {data, loading, error, refetch} = useFetch("http://localhost:4000/api/shift/")
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
          userId: shift.assignedEmployees?.map(emp => emp._id).join(", "),
          shiftType: shift.shiftType,
        },
      };
    });
    
    setEvents(formattedEvents);
    
  }, [data]);

  return (
    <div className="flex h-screen bg-gray-100">
      <NavbarAdmin />

      <div className="flex-1 p-6">
      <h3 className="text-xl text-center font-semibold mb-4">
          Manage Schedule for {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
        </h3>
        {/* Calendar Container */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl bg-white shadow-lg p-4 rounded-lg">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="dayGridMonth"
              timeZone="local" 
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
              slotMinTime="06:00:00"
              slotMaxTime="20:00:00"
              slotDuration="00:30:00" 
              dateClick={handleDateClick}
              events={events}
              eventClick={false}
            />
              <CreateShiftModal
              isOpen={isCreateModalOpen} 
              onClose={() => setIsCreateModalOpen(false)} 
              shiftDate={selectedDate} 
              onShiftAdded={refetch}
            />
            <UpdateShiftModal
              isOpen={isUpdateModalOpen} 
              onClose={() => setIsUpdateModalOpen(false)} 
              shiftDate={selectedShift} 
              shiftId={shiftID}
              onShiftUpdated={refetch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminManageShift
