import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(true);

    const handleMouseEnter = () => {
        setCollapsed(false);
        localStorage.setItem("sidebarCollapsed", "false");
        window.dispatchEvent(new Event("storage")); // Force update across components
    };

    const handleMouseLeave = () => {
        setCollapsed(true);
        localStorage.setItem("sidebarCollapsed", "true");
        window.dispatchEvent(new Event("storage")); // Force update across components
    };

    return (
        <div
            className={`${
                collapsed ? "w-20" : "w-64"
            } h-screen bg-gray-800 text-white fixed top-0 left-0 p-4 transition-all duration-300 flex flex-col z-50`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`flex items-center ${collapsed ? "justify-center" : "pl-2"}`}>
                <i className="bi bi-bar-chart-fill text-lg"></i>
                {!collapsed && <span className="ml-2 font-bold truncate">prepord</span>}
            </div>

            <hr className="border-t border-gray-700 my-4" />
            <p className={`text-gray-400 text-xs ${collapsed ? "text-center" : "px-4"}`}>
                {collapsed ? "VIEW" : "OVERVIEW"}
            </p>
            <hr className="border-t border-gray-700 my-4" />

            <nav className="flex-1 mt-2 overflow-y-auto">
                <ul className="space-y-4">
                    <li>
                        <Link to="/monitors" className={`flex items-center p-2 hover:bg-gray-700 rounded ${ collapsed ? "justify-center" : "pl-2" }`} >
                            <i className="bi bi-display-fill text-lg"></i> {!collapsed && <span className="ml-2 truncate">Monitors</span>}
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/television"
                            className={`flex items-center p-2 hover:bg-gray-700 rounded ${
                                collapsed ? "justify-center" : "pl-2"
                            }`}
                        >
                            <i className="bi bi-tv text-lg"></i>
                            {!collapsed && <span className="ml-2 truncate">Television</span>}
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/projectors"
                            className={`flex items-center p-2 hover:bg-gray-700 rounded ${
                                collapsed ? "justify-center" : "pl-2"
                            }`}
                        >
                            <i className="bi bi-projector text-lg"></i>
                            {!collapsed && <span className="ml-2 truncate">Projector</span>}
                        </Link>
                    </li>


                    <hr className="border-t border-gray-700 my-4" />
                    <p className={`text-gray-400 text-xs ${collapsed ? "text-center" : "px-4"}`}>
                        {collapsed ? "FUNC" : "FUNCTIONS"}
                    </p>
                    <hr className="border-t border-gray-700 my-4" />

                    <li>
                        <Link
                            to="/devices-add"
                            className={`flex items-center p-2 hover:bg-gray-700 rounded ${
                                collapsed ? "justify-center" : "pl-2"
                            }`}
                        >
                            <i className="bi bi-plus-circle text-lg"></i>
                            {!collapsed && <span className="ml-2 truncate">Add New Device</span>}
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/devices-management"
                            className={`flex items-center p-2 hover:bg-gray-700 rounded ${
                                collapsed ? "justify-center" : "pl-2"
                            }`}
                        >
                            <i className="bi bi-option text-lg"></i>
                            {!collapsed && <span className="ml-2 truncate">Sell & Delete</span>}
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/devices-edit"
                            className={`flex items-center p-2 hover:bg-gray-700 rounded ${
                                collapsed ? "justify-center" : "pl-2"
                            }`}
                        >
                            <i className="bi bi-pen text-lg"></i>
                            {!collapsed && <span className="ml-2 truncate">Edit Device</span>}
                        </Link>
                    </li>


                    <hr className="border-t border-gray-700 my-4" />
                    <p className={`text-gray-400 text-xs ${collapsed ? "text-center" : "px-4"}`}>
                        {collapsed ? "COMP" : "COMPARISON"}
                    </p>
                    <hr className="border-t border-gray-700 my-4" />


                    <li>
                        <Link
                            to="/devices-comparison"
                            className={`flex items-center p-2 hover:bg-gray-700 rounded ${
                                collapsed ? "justify-center" : "pl-2"
                            }`}
                        >
                            <i className="bi bi-arrows-fullscreen text-lg"></i>
                            {!collapsed && <span className="ml-2 truncate">Device Comparison</span>}
                        </Link>
                    </li>


                    <hr className="border-t border-gray-700 my-4" />
                    <p className={`text-gray-400 text-xs ${collapsed ? "text-center" : "px-4"}`}>
                        {collapsed ? "NUM" : "COUNTER"}
                    </p>
                    <hr className="border-t border-gray-700 my-4" />


                    <li>
                        <Link
                            to="/devices-number-of-devices"
                            className={`flex items-center p-2 hover:bg-gray-700 rounded ${
                                collapsed ? "justify-center" : "pl-2"
                            }`}
                        >
                            <i className="bi bi-123 text-lg"></i>
                            {!collapsed && <span className="ml-2 truncate">Number of Devices</span>}
                        </Link>
                    </li>


                    <li>
                        <Link
                            to="/devices-number-of-devices-tech-information"
                            className={`flex items-center p-2 hover:bg-gray-700 rounded ${
                                collapsed ? "justify-center" : "pl-2"
                            }`}
                        >
                            <i className="bi bi-journal-code text-lg"></i>
                            {!collapsed && <span className="ml-2 truncate">Num + Tech</span>}
                        </Link>
                    </li>

                    <hr className="border-t border-gray-700 my-4" />
                    <p className={`text-gray-400 text-xs ${collapsed ? "text-center" : "px-4"}`}>
                        {collapsed ? "REVE" : "REVENUE"}
                    </p>
                    <hr className="border-t border-gray-700 my-4" />

                    <li>
                        <Link
                            to="/devices-sales-revenue"
                            className={`flex items-center p-2 hover:bg-gray-700 rounded ${
                                collapsed ? "justify-center" : "pl-2"
                            }`}
                        >
                            <i className="bi bi-bank text-lg"></i>
                            {!collapsed && <span className="ml-2 truncate">Sales Revenue</span>}
                        </Link>
                    </li>


                    <li>
                        <Link
                            to="/devices-sales-logs"
                            className={`flex items-center p-2 hover:bg-gray-700 rounded ${
                                collapsed ? "justify-center" : "pl-2"
                            }`}
                        >
                            <i className="bi bi-receipt text-lg"></i>
                            {!collapsed && <span className="ml-2 truncate">Sales Logs</span>}
                        </Link>
                    </li>

                    <hr className="border-t border-gray-700 my-4" />
                    <p className={`text-gray-400 text-xs ${collapsed ? "text-center" : "px-4"}`}>
                        {collapsed ? "HOME" : "HOME"}
                    </p>
                    <hr className="border-t border-gray-700 my-4" />

                    <li>
                        <Link
                            to="/home-page"
                            className={`flex items-center p-2 hover:bg-gray-700 rounded ${
                                collapsed ? "justify-center" : "pl-2"
                            }`}
                        >
                            <i className="bi bi-sun text-lg"></i>
                            {!collapsed && <span className="ml-2 truncate">Homa Page</span>}
                        </Link>
                    </li>
                    <hr className="border-t border-gray-700 my-4" />

                </ul>
            </nav>
        </div>
    );
};

export default Navbar;
