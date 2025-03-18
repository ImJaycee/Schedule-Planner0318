import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaHome, FaBullhorn, FaUser, FaBars, FaTimes, FaClipboardList, FaRegCalendar } from "react-icons/fa";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // For click & drag events
import timeGridPlugin from "@fullcalendar/timegrid"; // For week/day views
import listPlugin from "@fullcalendar/list"; // For list vie
import NavbarEmployee from "../../components/NavbarEmployee";

const Dashboard = () => {
  const { user, dispatch } = useContext(AuthContext);
  

  
  return (
    <div className="flex h-screen bg-gray-100">
      <NavbarEmployee />


      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Hamburger Menu Button (Mobile) */}
        
        <h2 className="text-2xl font-semibold">Welcome, {user.user?.firstname || "Admin"}!</h2>

        {/* FullCalendar Component */}
        <div className="mt-6 bg-white shadow-lg p-4 rounded-lg">
        <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        height="auto"
        selectable={true}
        editable={true}
        dateClick={(info) => alert(`Clicked on: ${info.dateStr}`)}
        events={[
          {
            title: "Meeting",
            start: "2024-03-15T10:00:00",
            end: "2024-03-15T12:00:00",
            color: "blue",
          },
          {
            title: "Conference",
            start: "2024-03-18",
            end: "2024-03-20",
            color: "red",
          },
        ]}
      />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
