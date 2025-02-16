import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../configuration/Config.tsx";

interface Projector {
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

const GetProjectors: React.FC = () => {
    const [projectors, setProjectors] = useState<Projector[]>([]);
    const [filteredProjectors, setFilteredProjectors] = useState<Projector[]>([]);
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
        const fetchProjectors = async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}/GetProjector`, null, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(response.data, "text/xml");
                const projectorNodes = xmlDoc.getElementsByTagName("Projector");

                const projectorArray: Projector[] = Array.from(projectorNodes).map((projector) => ({
                    id: projector.getElementsByTagName("id")[0]?.textContent || "N/A",
                    brand: projector.getElementsByTagName("Brand")[0]?.textContent || "N/A",
                    model: projector.getElementsByTagName("Model")[0]?.textContent || "N/A",
                    displaySize: projector.getElementsByTagName("DisplaySize")[0]?.textContent || "N/A",
                    refreshRate: projector.getElementsByTagName("RefreshRate")[0]?.textContent || "N/A",
                    displayTech: projector.getElementsByTagName("DisplayTech")[0]?.textContent || "N/A",
                    pixelResolutions: projector.getElementsByTagName("PixelResolutions")[0]?.textContent || "N/A",
                    maxResolutions: projector.getElementsByTagName("MaxResolutions")[0]?.textContent || "N/A",
                    output: projector.getElementsByTagName("Output")[0]?.textContent || "N/A",
                    speaker: projector.getElementsByTagName("Speaker")[0]?.textContent || "N/A",
                    wirelessConnections: projector.getElementsByTagName("WirelessConnections")[0]?.textContent || "N/A",
                    bluetooth: projector.getElementsByTagName("Bluetooth")[0]?.textContent || "N/A",
                    connections: projector.getElementsByTagName("Connections")[0]?.textContent || "N/A",
                    smart: projector.getElementsByTagName("Smart")[0]?.textContent || "N/A",
                    os: projector.getElementsByTagName("OS")[0]?.textContent || "N/A",
                    vesa: projector.getElementsByTagName("VESA")[0]?.textContent || "N/A",
                    color: projector.getElementsByTagName("Color")[0]?.textContent || "N/A",
                    productionYear: projector.getElementsByTagName("ProductionYear")[0]?.textContent || "N/A",
                    stockDate: projector.getElementsByTagName("StockDate")[0]?.textContent || "N/A",
                    stock: projector.getElementsByTagName("Stock")[0]?.textContent || "N/A",
                    sold: projector.getElementsByTagName("Sold")[0]?.textContent || "N/A",
                    price: projector.getElementsByTagName("Price")[0]?.textContent || "N/A",
                    profit: projector.getElementsByTagName("Profit")[0]?.textContent || "N/A",
                }));

                setProjectors(projectorArray);
                setFilteredProjectors(projectorArray); // Initialize filtered projectors
                setLoading(false);
            } catch (error) {
                console.error("Error fetching projectors:", error);
                setError("Failed to load projector data.");
                setLoading(false);
            }
        };

        fetchProjectors();
    }, []);

    // Handle search input
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);

        // Filter projectors by Brand, ID, or Model
        const filtered = projectors.filter(
            (projector) =>
                projector.brand.toLowerCase().includes(value) ||
                projector.id.toLowerCase().includes(value) ||
                projector.model.toLowerCase().includes(value)
        );
        setFilteredProjectors(filtered);
    };

    return (
        <div className="flex">
            <div
                className={`transition-all duration-300 ${
                    collapsed ? "ml-20" : "ml-64"
                } w-full`}
            >
                <div className="bg-gray-900 w-full h-20 fixed top-0 flex items-center shadow-md pl-8 z-10">
                    <h1 className="text-2xl font-bold text-white flex items-center">
                        <i className="bi bi-projector mr-4"></i> Projector
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
                    {filteredProjectors.map((projector, index) => (
                        <div key={index} className="bg-gray-200 rounded-lg shadow-md p-4">
                            <h5 className="text-lg font-bold">{projector.brand}</h5>
                            <p className="text-gray-700 text-sm">
                                <strong>Type:</strong> Projector
                            </p>
                            <p className="text-gray-700 text-sm">
                                <strong>ID:</strong> {projector.id}
                            </p>
                            <p className="text-gray-700 text-sm">
                                <strong>Model:</strong> {projector.model}
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
                                            <strong>Display Size:</strong> {projector.displaySize}"
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Refresh Rate:</strong> {projector.refreshRate} Hz
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Display Technology:</strong> {projector.displayTech}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Pixel Resolution:</strong>{" "}
                                            {projector.pixelResolutions}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Max Resolution:</strong>{" "}
                                            {projector.maxResolutions}
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
                                            <strong>Output:</strong> {projector.output}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Speaker:</strong> {projector.speaker}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Wireless:</strong> {projector.wirelessConnections}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Bluetooth:</strong> {projector.bluetooth}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Connections:</strong> {projector.connections}
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
                                        <p className="text-gray-700 text-sm"><strong>Color:</strong> {projector.color}</p>
                                        <p className="text-gray-700 text-sm"><strong>Production Year:</strong>{" "}{projector.productionYear}</p>
                                        <p className="text-gray-700 text-sm"><strong>Stock Date:</strong> {projector.stockDate}</p>
                                        <p className="text-gray-700 text-sm"><strong>Stock:</strong> {projector.stock}</p>
                                        <p className="text-gray-700 text-sm"><strong>Sold:</strong> {projector.sold}</p>
                                        <p className="text-gray-700 text-sm"><strong>Price:</strong> $ {projector.price}</p>
                                        <p className="text-gray-700 text-sm"><strong>Profit:</strong> $ {projector.profit}</p>
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

export default GetProjectors;
