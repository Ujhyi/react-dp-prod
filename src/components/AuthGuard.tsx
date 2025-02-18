import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthGuard: React.FC = () => {
    const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
    const location = useLocation();

    console.log("AuthGuard - isAuthenticated:", isAuthenticated);
    console.log("Current Location:", location.pathname);

    if (!isAuthenticated) {
        console.warn("Unauthorized access attempt! Redirecting to login...");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default AuthGuard;
