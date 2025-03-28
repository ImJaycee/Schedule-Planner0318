import { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSignOutAlt, FaHome, FaBullhorn, FaUser, FaBars, FaTimes, FaClipboardList,FaExchangeAlt , FaRegCalendar, FaUserFriends, FaChevronDown } from "react-icons/fa";
import { AuthContext } from '../context/AuthContext';

import flexiSchedLogo from "../assets/flexi-no-name.png"; 

const NavbarAdmin = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [title, setTitle] = useState('Dashboard');

  const navlinks = [
    { link: "/admin/homepage", label: "Home", icon: <FaHome className="mr-3 text-blue-900" /> },
    { link: "/admin/manage-shift", label: "Manage Shift", icon: <FaRegCalendar className="mr-3 text-blue-900" /> },
    { link: "/admin/request-shift", label: "Requests", icon: <FaClipboardList className="mr-3 text-blue-900" /> },
    { link: "/admin/request-shift/swaps", label: "Shift Swap", icon: <FaExchangeAlt  className="mr-3 text-blue-900" /> },
    { link: "/admin/announcement", label: "Announcement", icon: <FaBullhorn className="mr-3 text-blue-900" /> },
    { link: "/admin/profile", label: "Profile", icon: <FaUser className="mr-3 text-blue-900" /> },
    { link: "/admin/user-accounts", label: "User Accounts", icon: <FaUserFriends className="mr-3 text-blue-900" /> }
  ];

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/admin/login");
  };

  const handleRoutes = (path, title) => {
    setTitle(title);
    navigate(path);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={` z-10 fixed md:relative top-0 left-0 w-64 h-full bg-white shadow-xl p-4 flex flex-col justify-between transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div>
          {/* Close Button (Mobile) */}
          <button className="md:hidden absolute top-4 right-4 text-gray-600" onClick={() => setIsSidebarOpen(false)}>
            <FaTimes size={24} />
          </button>

          <h5 className="text-xl font-semibold text-gray-900 mb-4">
            {location.pathname === "/admin/homepage" ? "Home" : 
             location.pathname === "/admin/manage-shift" ? "Manage Shift" : 
             location.pathname === "/admin/request-shift" ? "Requests" : 
             location.pathname === "/admin/request-shift/swaps" ? "Shift Swap" : 
             location.pathname === "/admin/announcement" ? "Announcement" : 
             location.pathname === "/admin/profile" ? "Profile" : 
             location.pathname === "/admin/user-accounts" ? "User Accounts" : title}
          </h5>

          <nav className="flex flex-col gap-2">
            {navlinks.map((navlink) => (
              <button
                key={navlink.link}
                className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition"
                onClick={() => handleRoutes(navlink.link, navlink.label)}
              >
                {navlink.icon}
                {navlink.label}
              </button>
            ))}
          </nav>
        </div>

        {/* User Info and Dropdown */}
        <div className="relative mt-6">
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <img src={flexiSchedLogo} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
            <span className="ml-3 text-gray-900">{user.user?.firstname} {user.user?.lastname}</span>
            <FaChevronDown className={`ml-3 text-gray-600 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
          <div className={`absolute bottom-full mb-2 bg-white shadow-lg rounded-lg w-full transition-all duration-300 ease-in-out ${isDropdownOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <button
              onClick={handleLogout}
              className="flex items-center p-3 w-full text-left text-red-600 hover:bg-red-50 transition"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
            <button
              onClick={() => navigate("/admin/change-password")}
              className="flex items-center p-3 w-full text-left text-gray-900 hover:bg-gray-50 transition"
            >
              <FaUser className="mr-3" />
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Hamburger Menu Button (Mobile) */}
        <button className="md:hidden mb-4 text-gray-600" onClick={() => setIsSidebarOpen(true)}>
          <FaBars size={24} />
        </button>
      </div>
    </div>
  );
};

export default NavbarAdmin;