import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaHome, FaUser, FaBars, FaTimes, FaClipboardList } from "react-icons/fa";
import { AuthContext } from '../context/AuthContext';

const NavbarEmployee = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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