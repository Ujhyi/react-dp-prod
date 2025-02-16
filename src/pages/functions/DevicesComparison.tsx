import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../configuration/Config.tsx";

interface Product {
    type: string;
    id: string;
    brand: string;
    model: string
    displaySize: string;

    refreshRate: string;
    displayTech: string;
    pixelResolutions: string;
    maxResolutions: string;

    output: string;
    speaker: string;
    bluetooth: string;
    connections: string;
    wirelessConnections: string;

    color: string;
    productionYear: string;
    stockDate: string;
    stock: string;
    sold: string;
    price: string;
    profit: string;
}

const DevicesComparison: React.FC = () => {
    const [productType, setProductType] = useState<string>("");
    const [displaySize, setDisplaySize] = useState<string>("");
    const [brand,setBrand] = useState<string>("");
    const [pixelResolutions, ] = useState<string>("");
    const [maxResolutions, setMaxResolution] = useState<string>("");
    const [stockDate] = useState<string>("");
    const [sortByPrice, ] = useState<string>("true");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [showDisplayInfo, setShowDisplayInfo] = useState<boolean>(true);
    const [showConnectivity, setShowConnectivity] = useState<boolean>(true);
    const [showAdditionalInfo, setShowAdditionalInfo] = useState<boolean>(true);



    useEffect(() => {
        handleFilterChange();
    }, [productType, displaySize, brand, pixelResolutions, maxResolutions, stockDate, sortByPrice]);

    const handleFilterChange = async () => {
        setLoading(true);

        const params: Record<string, string> = {
            productType: productType || "",
            displaySize: displaySize || "",
            brand: brand || "",
            pixelResolutions: pixelResolutions || "",
            maxResolutions: maxResolutions || "",
            stockDate: stockDate || "",
            sortByPrice: sortByPrice || "true",
        };

        const queryString = Object.keys(params)
            .map(
                (key) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
            )
            .join("&");

        try {
            const response = await fetch(
                `${API_BASE_URL}/GetFilteredProducts`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: queryString,
                }
            );

            const xmlString = await response.text();
            processFilteredProducts(xmlString);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const processFilteredProducts = (response: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, "text/xml");

        const productNodes = xmlDoc.getElementsByTagName("Products")[0]?.children || [];
        const allProducts = Array.from(productNodes).map((product) => ({
            type: product.tagName,
            id: product.getElementsByTagName("id")[0]?.textContent || "",
            brand: product.getElementsByTagName("Brand")[0]?.textContent || "",
            model: product.getElementsByTagName("Model")[0]?.textContent || "",
            displaySize: product.getElementsByTagName("DisplaySize")[0]?.textContent || "",

            refreshRate: product.getElementsByTagName("RefreshRate")[0]?.textContent || "",
            displayTech: product.getElementsByTagName("DisplayTech")[0]?.textContent || "",
            pixelResolutions: product.getElementsByTagName("PixelResolutions")[0]?.textContent || "",
            maxResolutions: product.getElementsByTagName("MaxResolutions")[0]?.textContent || "",

            output: product.getElementsByTagName("Output")[0]?.textContent || "",
            speaker: product.getElementsByTagName("Speaker")[0]?.textContent || "",
            bluetooth: product.getElementsByTagName("Bluetooth")[0]?.textContent || "",
            connections: product.getElementsByTagName("Connections")[0]?.textContent || "",
            wirelessConnections: product.getElementsByTagName("WirelessConnections")[0]?.textContent || "",

            color: product.getElementsByTagName("Color")[0]?.textContent || "",
            productionYear: product.getElementsByTagName("ProductionYear")[0]?.textContent || "",
            stockDate: product.getElementsByTagName("StockDate")[0]?.textContent || "",
            stock: product.getElementsByTagName("Stock")[0]?.textContent || "",
            sold: product.getElementsByTagName("Sold")[0]?.textContent || "",
            price: product.getElementsByTagName("Price")[0]?.textContent || "",
            profit: product.getElementsByTagName("Profit")[0]?.textContent || "",

        }));

        setFilteredProducts(allProducts);
    };
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

    return (
        <div className="flex">
            <div className={`transition-all duration-300 ${ collapsed ? "ml-20" : "ml-64" } w-full`} >
                <div className="bg-gray-900 w-full h-20 fixed top-0 flex items-center shadow-md pl-8 z-10">
                    <h1 className="text-2xl font-bold text-white flex items-center">
                        <i className="bi bi-display-fill mr-4"></i> Monitors
                    </h1>
                    {/* Comparison Input */}
                    <select
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                        className="ml-10 p-2 rounded-lg bg-gray-600 text-white border px-3 py-2 border-gray-600 focus:outline-none focus:ring focus:ring-blue-500 w-32 sm:w-60"
                    >
                        <option value="">All Product Types</option>
                        <option value="Monitor">Monitor</option>
                        <option value="Television">Television</option>
                        <option value="Projector">Projector</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Display Size"
                        value={displaySize}
                        onChange={(e) => setDisplaySize(e.target.value)}
                        className="ml-10 p-2 rounded-lg bg-gray-600 text-white border px-3 py-2 border-gray-600 focus:outline-none focus:ring focus:ring-blue-500 w-32 sm:w-60"
                    />
                    <input
                        type="text"
                        placeholder="Brand"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="ml-10 p-2 rounded-lg bg-gray-600 text-white border px-3 py-2 border-gray-600 focus:outline-none focus:ring focus:ring-blue-500 w-32 sm:w-60"
                    />
                    <input
                        type="text"
                        placeholder="Max Resolutions"
                        value={maxResolutions}
                        onChange={(e) => setMaxResolution(e.target.value)}
                        className="ml-10 p-2 rounded-lg bg-gray-600 text-white border px-3 py-2 border-gray-600 focus:outline-none focus:ring focus:ring-blue-500 w-32 sm:w-60"
                    />
                </div>
                {loading && <p className="text-center text-gray-500 mt-10">Loading...</p>}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-24 px-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <div key={index} className="bg-gray-200 rounded-lg shadow-md p-4">
                                <h5 className="text-lg font-bold">{product.brand}</h5>
                                <p className="text-gray-700 text-sm"><strong>Type:</strong> {product.type}</p>
                                <p className="text-gray-700 text-sm"><strong>ID:</strong> {product.id}</p>
                                <p className="text-gray-700 text-sm"><strong>Model:</strong> {product.model}</p>

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
                                            <p><strong>Display Size:</strong> {product.displaySize}"</p>
                                            <p><strong>Refresh Rate:</strong> {product.refreshRate}</p>
                                            <p><strong>Pixel Resolution:</strong> {product.pixelResolutions}</p>
                                            <p><strong>Max Resolution:</strong> {product.maxResolutions}</p>
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
                                                    showDisplayInfo ? "bi-eye-slash" : "bi-eye"
                                                }`}
                                            ></i>
                                        </button>
                                    </div>
                                    {showConnectivity && (
                                        <div className="p-4">
                                            <p><strong>Output:</strong> {product.output}</p>
                                            <p><strong>Speaker:</strong> {product.speaker}</p>
                                            <p><strong>Wireless Connectivity:</strong> {product.wirelessConnections}</p>
                                            <p><strong>Bluetooth:</strong> {product.bluetooth}</p>
                                            <p><strong>Connectivity:</strong> {product.connections}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Additionl Information */}
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
                                            <p><strong>Color:</strong> {product.color}</p>
                                            <p><strong>Porduction Year:</strong> {product.productionYear}</p>
                                            <p><strong>Stock Date:</strong> {product.stockDate}</p>
                                            <p><strong>Stock:</strong> {product.stock}</p>
                                            <p><strong>Sold:</strong> {product.sold}</p>
                                            <p><strong>Price:</strong> {product.price}</p>
                                            <p><strong>Profit:</strong> {product.profit}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        !loading && <p className="text-center text-gray-500">No products found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DevicesComparison;
