import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import NavbarEmployee from "../../components/NavbarEmployee";




const ReqShift = () => {
  const { user, dispatch } = useContext(AuthContext);
  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <NavbarEmployee/>


      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Hamburger Menu Button (Mobile) */}
      
        <h2 className="text-2xl font-semibold">Welcome, {user.user?.firstname || "Admin"}!</h2>

        
      
      </div>
    </div>
  );
};

export default ReqShift;
