import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; 
const ProtectedRoutes = () => {
    const { user } = useContext(AuthContext); // Get the actual user data

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
