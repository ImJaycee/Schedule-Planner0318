import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; 
const ProtectedRoutesAdmin = () => {
    const { user } = useContext(AuthContext); // Get the actual user data
    return user && user.user.isAdmin === true ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default ProtectedRoutesAdmin;
