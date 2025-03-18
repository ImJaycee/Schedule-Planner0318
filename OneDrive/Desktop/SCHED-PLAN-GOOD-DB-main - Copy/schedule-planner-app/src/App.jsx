import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoutes from './utils/ProtectedRoutes';
import ProtectedRoutesAdmin from './utils/ProtectedRoutesAdmin';
import RegisterForm from './pages/RegistrationForm';
import AdminRegistrationForm from './pages/AdminRegistrationForm';
import Login from './pages/Login';
import Dashboard from './pages/Employee/Dashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import ReqShift from './pages/Employee/ReqShift';
import Profile from './pages/Employee/Profile';
import AdminAnnouncement from './pages/Admin/AdminAnnouncement';
import AdminManageShift from './pages/Admin/AdminManageShift';
import AdminRequest from './pages/Admin/AdminRequest';
import AdminProfile from './pages/Admin/AdminProfile';
import ProfileEditPage from './pages/Employee/ProfileEditPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminProfileEditPage from './pages/Admin/AdminProfileEditPage';

function App() {  
  return (
    <AuthContextProvider>
      <Router>
        <div>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/admin/register" element={<AdminRegistrationForm />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/homepage" element={<Dashboard />} />
              <Route path="/request-shift" element={<ReqShift />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile-edit" element={<ProfileEditPage />} />
            </Route>

            <Route element={<ProtectedRoutesAdmin />}>
              <Route path="/admin/announcement" element={<AdminAnnouncement />} />
              <Route path="/admin/manage-shift" element={<AdminManageShift />} />
              <Route path="/admin/request-shift" element={<AdminRequest />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/admin/homepage" element={<AdminDashboard />} />
              <Route path="/admin/profile-edit" element={<AdminProfileEditPage />} />
            </Route>
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </AuthContextProvider>
  );
}

export default App;