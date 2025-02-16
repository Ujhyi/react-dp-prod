import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../configuration/Config.tsx";

interface Monitor {
    id: string;
    brand: string;
    model: string;
    displaySize: string;
    refreshRate: string;
    displayTech: string;
    pixelResolutions: string;
    maxResolutions: string;
    output: string;
    speaker: string;
    wirelessConnections: string;
    bluetooth: string;
    connections: string;
    smart: string;
    os: string;
    vesa: string;
    color: string;
    productionYear: string;
    stockDate: string;
    stock: string;
    sold: string;
    price: string;
    profit: string;
}


const GetMonitors: React.FC = () => {
    const [monitors, setMonitors] = useState<Monitor[]>([]);
    const [filteredMonitors, setFilteredMonitors] = useState<Monitor[]>([]);
    const [searchTerm, setSearchTerm] = useState(""); // Search term state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Global toggle states for all sections
    const [showDisplayInfo, setShowDisplayInfo] = useState<boolean>(true);
    const [showConnectivity, setShowConnectivity] = useState<boolean>(true);
    const [showAdditionalInfo, setShowAdditionalInfo] = useState<boolean>(true);

    // Sidebar state synced with localStorage
    const [collapsed, setCollapsed] = useState(
        localStorage.getItem("sidebarCollapsed") === "true"
    );

    useEffect(() => {
        const handleSidebarState = () => {
            setCollapsed(localStorage.getItem("sidebarCollapsed") === "true");
        };

        window.addEventListener("storage", handleSidebarState);

        return () => {
            window.removeEventListener("storage", handleSidebarState);
        };
    }, []);

    useEffect(() => {
        const fetchMonitors = async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}/GetMonitors`, null, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(response.data, "text/xml");
                const monitorNodes = xmlDoc.getElementsByTagName("Monitor");

                const monitorArray: Monitor[] = Array.from(monitorNodes).map((monitor) => ({
                    id: monitor.getElementsByTagName("id")[0]?.textContent || "N/A",
                    brand: monitor.getElementsByTagName("Brand")[0]?.textContent || "N/A",
                    model: monitor.getElementsByTagName("Model")[0]?.textContent || "N/A",
                    displaySize: monitor.getElementsByTagName("DisplaySize")[0]?.textContent || "N/A",
                    refreshRate: monitor.getElementsByTagName("RefreshRate")[0]?.textContent || "N/A",
                    displayTech: monitor.getElementsByTagName("DisplayTech")[0]?.textContent || "N/A",
                    pixelResolutions: monitor.getElementsByTagName("PixelResolutions")[0]?.textContent || "N/A",
                    maxResolutions: monitor.getElementsByTagName("MaxResolutions")[0]?.textContent || "N/A",
                    output: monitor.getElementsByTagName("Output")[0]?.textContent || "N/A",
                    speaker: monitor.getElementsByTagName("Speaker")[0]?.textContent || "N/A",
                    wirelessConnections: monitor.getElementsByTagName("WirelessConnections")[0]?.textContent || "N/A",
                    bluetooth: monitor.getElementsByTagName("Bluetooth")[0]?.textContent || "N/A",
                    connections: monitor.getElementsByTagName("Connections")[0]?.textContent || "N/A",
                    smart: monitor.getElementsByTagName("Smart")[0]?.textContent || "N/A",
                    os: monitor.getElementsByTagName("OS")[0]?.textContent || "N/A",
                    vesa: monitor.getElementsByTagName("VESA")[0]?.textContent || "N/A",
                    color: monitor.getElementsByTagName("Color")[0]?.textContent || "N/A",
                    productionYear: monitor.getElementsByTagName("ProductionYear")[0]?.textContent || "N/A",
                    stockDate: monitor.getElementsByTagName("StockDate")[0]?.textContent || "N/A",
                    stock: monitor.getElementsByTagName("Stock")[0]?.textContent || "N/A",
                    sold: monitor.getElementsByTagName("Sold")[0]?.textContent || "N/A",
                    price: monitor.getElementsByTagName("Price")[0]?.textContent || "N/A",
                    profit: monitor.getElementsByTagName("Profit")[0]?.textContent || "N/A",
                }));

                setMonitors(monitorArray);
                setFilteredMonitors(monitorArray); // Initialize filtered monitors
                setLoading(false);
            } catch (error) {
                console.error("Error fetching monitors:", error);
                setError("Failed to load monitor data.");
                setLoading(false);
            }
        };

        fetchMonitors();
    }, []);

    // Handle search input
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);

        // Filter monitors by Brand, ID, or Model
        const filtered = monitors.filter(
            (monitor) =>
                monitor.brand.toLowerCase().includes(value) ||
                monitor.id.toLowerCase().includes(value) ||
                monitor.model.toLowerCase().includes(value)
        );
        setFilteredMonitors(filtered);
    };

    return (
        <div className="flex">
            <div className={`transition-all duration-300 ${ collapsed ? "ml-20" : "ml-64" } w-full`} >
                <div className="bg-gray-900 w-full h-20 fixed top-0 flex items-center shadow-md pl-8 z-10">
                    <h1 className="text-2xl font-bold text-white flex items-center">
                        <i className="bi bi-display-fill mr-4"></i> Monitors
                    </h1>
                    {/* Search Input */}
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search by Brand, ID, or Model"
                        className="ml-10 p-2 rounded-lg bg-gray-600 text-white border px-3 py-2 border-gray-600 focus:outline-none focus:ring focus:ring-blue-500 w-32 sm:w-60"
                    />
            </div>

            {loading && <p className="text-gray-600 mt-20">Loading...</p>}
            {error && <p className="text-red-600 mt-20">{error}</p>}

            {/* Monitor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-24 px-6">
                {filteredMonitors.map((monitor, index) => (
                    <div key={index} className="bg-gray-200 rounded-lg shadow-md p-4">
                            <h5 className="text-lg font-bold">{monitor.brand}</h5>
                            <p className="text-gray-700 text-sm">
                                <strong>Type:</strong> Monitor
                            </p>
                            <p className="text-gray-700 text-sm">
                                <strong>ID:</strong> {monitor.id}
                            </p>
                            <p className="text-gray-700 text-sm">
                                <strong>Model:</strong> {monitor.model}
                            </p>

                            {/* Display Information Section */}
                            <div className="bg-white mt-4 rounded-lg shadow-inner">
                                <div className="bg-gray-700 text-white flex justify-between items-center p-2 rounded-t-lg">
                                    <span className="text-sm">Display Information</span>
                                    <button
                                        onClick={() => setShowDisplayInfo((prev) => !prev)}
                                        className="text-white focus:outline-none"
                                    >
                                        <i
                                            className={`bi ${
                                                showDisplayInfo ? "bi-eye-slash" : "bi-eye"
                                            }`}
                                        ></i>
                                    </button>
                                </div>
                                {showDisplayInfo && (
                                    <div className="p-4">
                                        <p className="text-gray-700 text-sm">
                                            <strong>Display Size:</strong> {monitor.displaySize}"
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Refresh Rate:</strong> {monitor.refreshRate} Hz
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Display Technology:</strong> {monitor.displayTech}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Pixel Resolution:</strong>{" "}
                                            {monitor.pixelResolutions}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Max Resolution:</strong>{" "}
                                            {monitor.maxResolutions}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Connectivity Section */}
                            <div className="bg-white mt-4 rounded-lg shadow-inner">
                                <div className="bg-gray-700 text-white flex justify-between items-center p-2 rounded-t-lg">
                                    <span className="text-sm">Connectivity</span>
                                    <button
                                        onClick={() => setShowConnectivity((prev) => !prev)}
                                        className="text-white focus:outline-none"
                                    >
                                        <i
                                            className={`bi ${
                                                showConnectivity ? "bi-eye-slash" : "bi-eye"
                                            }`}
                                        ></i>
                                    </button>
                                </div>
                                {showConnectivity && (
                                    <div className="p-4">
                                        <p className="text-gray-700 text-sm">
                                            <strong>Output:</strong> {monitor.output}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Speaker:</strong> {monitor.speaker}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Wireless:</strong> {monitor.wirelessConnections}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Bluetooth:</strong> {monitor.bluetooth}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Connections:</strong> {monitor.connections}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Additional Information Section */}
                            <div className="bg-white mt-4 rounded-lg shadow-inner">
                                <div className="bg-gray-700 text-white flex justify-between items-center p-2 rounded-t-lg">
                                    <span className="text-sm">Additional Information</span>
                                    <button
                                        onClick={() => setShowAdditionalInfo((prev) => !prev)}
                                        className="text-white focus:outline-none"
                                    >
                                        <i
                                            className={`bi ${
                                                showAdditionalInfo ? "bi-eye-slash" : "bi-eye"
                                            }`}
                                        ></i>
                                    </button>
                                </div>
                                {showAdditionalInfo && (
                                    <div className="p-4">
                                        <p className="text-gray-700 text-sm">
                                            <strong>Color:</strong> {monitor.color}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Production Year:</strong>{" "}
                                            {monitor.productionYear}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Stock Date:</strong> {monitor.stockDate}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Stock:</strong> {monitor.stock}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Sold:</strong> {monitor.sold}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Price:</strong> $ {monitor.price}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Profit:</strong> $ {monitor.profit}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GetMonitors;

