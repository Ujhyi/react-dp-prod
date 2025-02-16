import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute: React.FC = () => {
    const location = useLocation();

    const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
    const isAuthenticatedFromServer = localStorage.getItem("isAuthenticatedFromServer") === "true";

    console.log("Checking Authentication...");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("isAuthenticatedFromServer:", isAuthenticatedFromServer);

    if (!isAuthenticated || !isAuthenticatedFromServer) {
        console.warn("🚫 Access Denied! Redirecting to login...");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <Outlet />;
};

export default PrivateRoute;
