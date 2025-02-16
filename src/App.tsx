/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'*/
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
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

// ✅ Fix: Define `children` in `Layout` component
interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

    useEffect(() => {
        if (window.location.pathname === "/") {
            window.location.replace("/home-page");
        }
    }, []);


    const hideNavbarRoutes = ["/register", "/change-password", "/login"];

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
            <Router>
                <Layout>
                    <Routes>
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
            </Router>
        </SidebarProvider>
    );
};

export default App;

/*
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/