import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { FaSignOutAlt, FaHome, FaUser, FaBars, FaTimes, FaClipboardList, FaChevronDown } from "react-icons/fa";
import { AuthContext } from '../context/AuthContext';

import flexiSchedLogo from "../assets/flexi-no-name.png"; 

=======
import { FaSignOutAlt, FaHome, FaUser, FaBars, FaTimes, FaClipboardList } from "react-icons/fa";
import { AuthContext } from '../context/AuthContext';

>>>>>>> origin/request-process
const NavbarEmployee = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
<<<<<<< HEAD
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
=======
>>>>>>> origin/request-process
  const [title, setTitle] = useState('Dashboard');
  const location = useLocation();
  const navlinks = [
    { link: "/homepage", label: "Home", icon: <FaHome className="mr-3 text-blue-900" /> },
    { link: "/request-shift", label: "Request Shift", icon: <FaClipboardList className="mr-3 text-blue-900" /> },
    { link: "/profile", label: "Profile", icon: <FaUser className="mr-3 text-blue-900" /> }
  ];

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/admin/login");
  };

  const handleRoutes = (path, title) => {
    navigate(path);
    setTitle(title);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
<<<<<<< HEAD
        className={`fixed md:relative top-0 left-0 w-64 h-full bg-white shadow-xl p-4 flex flex-col justify-between transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div>
          {/* Close Button (Mobile) */}
          <button
            className="md:hidden absolute top-4 right-4 text-gray-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes size={24} />
          </button>

          <h5 className="text-xl font-semibold text-gray-900 mb-4">
            {location.pathname === "/homepage" ? "Home" : location.pathname === "/request-shift" ? "Request Shift" : location.pathname === "/profile" ? "Profile" : title}
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
              onClick={() => navigate("/change-password")}
              className="flex items-center p-3 w-full text-left text-gray-900 hover:bg-gray-50 transition"
            >
              <FaUser className="mr-3" />
              Change Password
            </button>
          </div>
        </div>
=======
        className={`fixed md:relative top-0 left-0 w-64 h-full bg-white shadow-xl p-4 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Close Button (Mobile) */}
        <button
          className="md:hidden absolute top-4 right-4 text-gray-600"
          onClick={() => setIsSidebarOpen(false)}
        >
          <FaTimes size={24} />
        </button>

        <h5 className="text-xl font-semibold text-gray-900 mb-4">
          {location.pathname === "/homepage" ? "Home" : location.pathname === "/request-shift" ? "Request Shift" : location.pathname === "/profile" ? "Profile" : title}
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
          <button
            onClick={handleLogout}
            className="flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </nav>
>>>>>>> origin/request-process
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

export default NavbarEmployee;