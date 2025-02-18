import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
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
import AuthGuard from "./components/AuthGuard.tsx";
import { Outlet } from "react-router-dom";


const Layout: React.FC = () => {
    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 transition-all duration-300">
                <Outlet />
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <SidebarProvider>
            <HashRouter> {/* Removed basename */}
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/change-password" element={<ChangePassword />} />

                    <Route element={<AuthGuard />}>
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
                        </Route>
                    </Route>
                </Routes>
            </HashRouter>
        </SidebarProvider>
    );
};


export default App;
