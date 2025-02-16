import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../configuration/Config.tsx";

interface Television {
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

const GetTelevision: React.FC = () => {
    const [televisions, setTelevisions] = useState<Television[]>([]);
    const [filteredTelevisions, setFilteredTelevisions] = useState<Television[]>([]);
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
        const fetchTelevisions = async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}/GetTelevision`, null, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(response.data, "text/xml");
                const televisionNodes = xmlDoc.getElementsByTagName("Television");

                const televisionArray: Television[] = Array.from(televisionNodes).map((television) => ({
                    id: television.getElementsByTagName("id")[0]?.textContent || "N/A",
                    brand: television.getElementsByTagName("Brand")[0]?.textContent || "N/A",
                    model: television.getElementsByTagName("Model")[0]?.textContent || "N/A",
                    displaySize: television.getElementsByTagName("DisplaySize")[0]?.textContent || "N/A",
                    refreshRate: television.getElementsByTagName("RefreshRate")[0]?.textContent || "N/A",
                    displayTech: television.getElementsByTagName("DisplayTech")[0]?.textContent || "N/A",
                    pixelResolutions: television.getElementsByTagName("PixelResolutions")[0]?.textContent || "N/A",
                    maxResolutions: television.getElementsByTagName("MaxResolutions")[0]?.textContent || "N/A",
                    output: television.getElementsByTagName("Output")[0]?.textContent || "N/A",
                    speaker: television.getElementsByTagName("Speaker")[0]?.textContent || "N/A",
                    wirelessConnections: television.getElementsByTagName("WirelessConnections")[0]?.textContent || "N/A",
                    bluetooth: television.getElementsByTagName("Bluetooth")[0]?.textContent || "N/A",
                    connections: television.getElementsByTagName("Connections")[0]?.textContent || "N/A",
                    smart: television.getElementsByTagName("Smart")[0]?.textContent || "N/A",
                    os: television.getElementsByTagName("OS")[0]?.textContent || "N/A",
                    vesa: television.getElementsByTagName("VESA")[0]?.textContent || "N/A",
                    color: television.getElementsByTagName("Color")[0]?.textContent || "N/A",
                    productionYear: television.getElementsByTagName("ProductionYear")[0]?.textContent || "N/A",
                    stockDate: television.getElementsByTagName("StockDate")[0]?.textContent || "N/A",
                    stock: television.getElementsByTagName("Stock")[0]?.textContent || "N/A",
                    sold: television.getElementsByTagName("Sold")[0]?.textContent || "N/A",
                    price: television.getElementsByTagName("Price")[0]?.textContent || "N/A",
                    profit: television.getElementsByTagName("Profit")[0]?.textContent || "N/A",
                }));

                setTelevisions(televisionArray);
                setFilteredTelevisions(televisionArray); // Initialize filtered televisions
                setLoading(false);
            } catch (error) {
                console.error("Error fetching televisions:", error);
                setError("Failed to load television data.");
                setLoading(false);
            }
        };

        fetchTelevisions();
    }, []);

    // Handle search input
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);

        // Filter televisions by Brand, ID, or Model
        const filtered = televisions.filter(
            (television) =>
                television.brand.toLowerCase().includes(value) ||
                television.id.toLowerCase().includes(value) ||
                television.model.toLowerCase().includes(value)
        );
        setFilteredTelevisions(filtered);
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
                        <i className="bi bi-tv mr-4"></i> Televisions
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
                    {filteredTelevisions.map((television, index) => (
                        <div key={index} className="bg-gray-200 rounded-lg shadow-md p-4">
                            <h5 className="text-lg font-bold">{television.brand}</h5>
                            <p className="text-gray-700 text-sm">
                                <strong>Type:</strong> Television
                            </p>
                            <p className="text-gray-700 text-sm">
                                <strong>ID:</strong> {television.id}
                            </p>
                            <p className="text-gray-700 text-sm">
                                <strong>Model:</strong> {television.model}
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
                                            <strong>Display Size:</strong> {television.displaySize}"
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Refresh Rate:</strong> {television.refreshRate} Hz
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Display Technology:</strong> {television.displayTech}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Pixel Resolution:</strong>{" "}
                                            {television.pixelResolutions}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Max Resolution:</strong>{" "}
                                            {television.maxResolutions}
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
                                            <strong>Output:</strong> {television.output}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Speaker:</strong> {television.speaker}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Wireless:</strong> {television.wirelessConnections}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Bluetooth:</strong> {television.bluetooth}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Connections:</strong> {television.connections}
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
                                            <strong>Color:</strong> {television.color}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Production Year:</strong>{" "}
                                            {television.productionYear}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Stock Date:</strong> {television.stockDate}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Stock:</strong> {television.stock}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Sold:</strong> {television.sold}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Price:</strong> $ {television.price}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Profit:</strong> $ {television.profit}
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

export default GetTelevision;
