import './App.css';
import {BrowserRouter, Navigate, Route, Routes,} from "react-router-dom";
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

import Home from "./pages/home/Home.tsx";
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/CreateUser.tsx";
import ChangePassword from "./pages/auth/ChangePassword.tsx";
import {useEffect} from "react";


interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

    useEffect(() => {
        if (window.location.pathname === "/") {
            window.location.replace("/home-page");
        }
    }, []);


    const hideNavbarRoutes = ["/react-dp-prod/register", "/react-dp-prod/change-password", "/react-dp-prod/login"];

    return (
        <div className="flex">
            {/* ✅ Show Navbar only if NOT on login, register, or change-password pages */}
            {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

            <div className="flex-1 transition-all duration-300">
                {children} {/* ✅ Ensure `children` is used correctly */}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <SidebarProvider>
            {/* Use BrowserRouter only once, and set the basename correctly */}
            <BrowserRouter basename="/react-dp-prod">
                <Layout>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />


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

                        <Route path="/home-page" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/change-password" element={<ChangePassword />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </SidebarProvider>
    );
};

export default App;

/*
                        <Route element={<PrivateRoute />}>
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
                        </Route>
 */