import './App.css';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { SidebarProvider } from "./components/SidebarContext.tsx";
import Navbar from "./components/Navbar.tsx";
import GetMonitors from "./pages/functions/GetMonitor.tsx";
import GetTelevision from "./pages/functions/GetTelevision.tsx";
import GetProjector from "./pages/functions/GetProjector.tsx";
import DevicesAdd from "./pages/functions/DevicesAdd.tsx";
import DevicesManagement from "./pages/functions/DevicesManagement.tsx";
import DevicesEdit from "./pages/functions/DevicesEdit.tsx";
import DevicesComparison from "./pages/functions/DevicesComparison.tsx";
import NumberOfDevices from "./pages/data_manager/NumberOfDevices.tsx";
import NumberOfDevicesTechInformation from "./pages/data_manager/NumberOfDevicesTechInformation.tsx";
import SalesRevenue from "./pages/data_manager/SalesRevenue.tsx";
import SalesLogs from "./pages/data_manager/SalesLogs.tsx";
import Register from "./pages/auth/CreateUser.tsx";
import ChangePassword from "./pages/auth/ChangePassword.tsx";
import Home from "./pages/home/Home.tsx";
import Login from "./pages/auth/Login.tsx";
import { Outlet } from "react-router-dom";

/** ✅ Layout Component - Wraps all routes EXCEPT login */
const Layout: React.FC = () => {
    const location = useLocation();

    // ✅ Hide Navbar ONLY on the login page
    const shouldShowNavbar = !["/login", "/change-password"].includes(location.pathname);

    return (
        <div className="flex">
            {shouldShowNavbar && <Navbar />} {/* Navbar is hidden on login */}
            <div className="flex-1 transition-all duration-300">
                <Outlet /> {/* ✅ This is necessary for rendering child routes */}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <SidebarProvider>
            <BrowserRouter basename="/react-dp-prod">
                <Routes>
                    {/* ✅ Redirect root `/` to `/login` */}
                    <Route path="/" element={<Navigate to="/login" />} />

                    {/* ✅ Login Page - No Layout */}
                    <Route path="/login" element={<Login />} />

                    {/* ✅ Wrap protected routes inside `Layout` */}
                    <Route element={<Layout />}>
                        <Route path="/home-page" element={<Home />} />
                        <Route path="/monitors" element={<GetMonitors />} />
                        <Route path="/television" element={<GetTelevision />} />
                        <Route path="/projectors" element={<GetProjector />} />
                        <Route path="/devices-add" element={<DevicesAdd />} />
                        <Route path="/devices-management" element={<DevicesManagement />} />
                        <Route path="/devices-edit" element={<DevicesEdit />} />
                        <Route path="/devices-comparison" element={<DevicesComparison />} />
                        <Route path="/devices-number-of-devices" element={<NumberOfDevices />} />
                        <Route path="/devices-number-of-devices-tech-information" element={<NumberOfDevicesTechInformation />} />
                        <Route path="/devices-sales-revenue" element={<SalesRevenue />} />
                        <Route path="/devices-sales-logs" element={<SalesLogs />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/change-password" element={<ChangePassword />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </SidebarProvider>
    );
};

export default App;
