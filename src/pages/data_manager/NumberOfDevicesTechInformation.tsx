import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../configuration/Config.tsx";

interface Product {
    id: string;
    productType: string;
    brand: string;
    model: string;
    price: number;
    soldNum: number;
    revenue: number;
    remains: number;
    stockDate: string;
    totalOnStock: number;
    soldCount: number;
    remaining: number;
    stockFromDate: number;
    stockToEndDate: number;
    displaySize: number;
    maxResolutions: string;
    color: string;
    refreshRate: string;
    displayTech: string;
    pixelResolutions: string;
    output: string;
    speaker: string;
    wirelessConnections: string;
    bluetooth: string;
    connections: string;
    smart: string;
    os: string;
    vesa: string;
    productionYear: number;
}

interface Model {
    modelName: string;
    totalStock: number;
    totalSold: number;
    remaining: number;
    productType: string;
    stockFromDate: string;
    stockToEndDate: string;
}

interface Brand {
    brandName: string;
    models: Model[];
}


const StockInfo: React.FC = () => {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [productType, setProductType] = useState<string>("All");
    const [displaySizeFilter, setDisplaySizeFilter] = useState<string>("");
    const [maxResolutionsFilter, setMaxResolutionsFilter] = useState<string>("");
    const [priceSortOrder, setPriceSortOrder] = useState<"asc" | "desc" | "">("");
    const [displaySizeSortOrder, setDisplaySizeSortOrder] = useState<"asc" | "desc" | "">("");
    const [showAll, setShowAll] = useState<boolean>(false);
    const [filteredSummaryData, setFilteredSummaryData] = useState<Brand[]>([]);
    const countDeviceByDateDetailTech2 = `${API_BASE_URL}/GetStockInformation_StartToEnd_NOD_TI_2`;
    const [, setSummary] = useState<Brand[]>([]);




    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Get max resolution options dynamically
    const getMaxResolutionOptions = () => {
        switch (productType) {
            case "Monitor":
                return ["Full HD", "4K"];
            case "Television":
                return ["Full HD", "4K", "8K"];
            default:
                return [];
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetchData();
            fetchSummaryData2();
        }
    }, [startDate, endDate, productType, displaySizeFilter, maxResolutionsFilter, priceSortOrder, displaySizeSortOrder]);

    useEffect(() => {
        filterData();
    }, [searchQuery, productType, allProducts]);

    const fetchData = async () => {
        try {
            const params = new URLSearchParams();
            params.append("startDate", formatDate(startDate));
            params.append("endDate", formatDate(endDate));
            params.append("productTypeFilter", productType);
            params.append("displaySizeFilter", displaySizeFilter);
            params.append("maxResolutionsFilter", maxResolutionsFilter);
            params.append("priceSortOrder", priceSortOrder);
            params.append("displaySizeSortOrder", displaySizeSortOrder);

            const response = await axios.post(
                "http://localhost:51834/WebService.asmx/GetStockInformation_StartToEnd_NOD_TI_1",
                params,
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                }
            );

            const parsedData = parseXML(response.data);
            setAllProducts(parsedData);
            setFilteredProducts(parsedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchSummaryData2 = async () => {
        const formattedStartDate = convertDateFormat(startDate);
        const formattedEndDate = convertDateFormat(endDate);

        const body = new URLSearchParams();
        body.append("startDate", formattedStartDate);
        body.append("endDate", formattedEndDate);

        try {
            const response = await fetch(countDeviceByDateDetailTech2, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: body.toString(),
            });

            const xmlText = await response.text();
            const parsedData = parseSummaryXmlData(xmlText);
            setSummary(parsedData);
            setFilteredSummaryData(parsedData);
        } catch (error) {
            console.error("Error fetching summary data:", error);
        }
    };

    const parseSummaryXmlData = (xmlData: string): Brand[] => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, "text/xml");
        const productsInfo = xmlDoc.getElementsByTagName("Brand");
        const summaryData: Brand[] = [];

        for (let i = 0; i < productsInfo.length; i++) {
            const brandName = productsInfo[i].getElementsByTagName("brandName")[0]?.textContent || "";
            const models = productsInfo[i].getElementsByTagName("Model");
            const brandModels: Model[] = [];

            for (let j = 0; j < models.length; j++) {
                const modelName = models[j].getElementsByTagName("modelName")[0]?.textContent || "";
                const totalStock = parseFloat(models[j].getElementsByTagName("totalStock")[0]?.textContent?.replace(",", ".") || "0");
                const totalSold = parseFloat(models[j].getElementsByTagName("totalSold")[0]?.textContent?.replace(",", ".") || "0");
                const remaining = parseFloat(models[j].getElementsByTagName("remaining")[0]?.textContent?.replace(",", ".") || "0");
                const productType = models[j].getElementsByTagName("productType")[0]?.textContent || "";
                const stockFromDate = models[j].getElementsByTagName("stockFromDate")[0]?.textContent || "";
                const stockToEndDate = models[j].getElementsByTagName("stockToEndDate")[0]?.textContent || "";

                brandModels.push({
                    modelName,
                    totalStock,
                    totalSold,
                    remaining,
                    productType,
                    stockFromDate,
                    stockToEndDate,
                });
            }

            summaryData.push({
                brandName,
                models: brandModels,
            });
        }
        return summaryData;
    };

    const convertDateFormat = (date: string): string => {
        const [year, month, day] = date.split("-");
        return `${month}-${day}-${year}`;
    };

    const filterData = () => {
        let filtered = allProducts;

        if (productType !== "All") {
            filtered = filtered.filter((p) => p.productType === productType);
        }

        if (searchQuery) {
            filtered = filtered.filter(
                (p) =>
                    p.id.includes(searchQuery) ||
                    p.model.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by Display Size
        if (displaySizeFilter) {
            const displaySizeValue = parseFloat(displaySizeFilter);
            if (!isNaN(displaySizeValue)) {
                filtered = filtered.filter((p) => p.displaySize === displaySizeValue);
            }
        }

        // Apply sorting
        if (priceSortOrder) {
            filtered = [...filtered].sort((a, b) =>
                priceSortOrder === "asc" ? a.price - b.price : b.price - a.price
            );
        }

        if (displaySizeSortOrder) {
            filtered = [...filtered].sort((a, b) =>
                displaySizeSortOrder === "asc" ? a.displaySize - b.displaySize : b.displaySize - a.displaySize
            );
        }

        setFilteredProducts(filtered);
    };

    const formatDate = (date: string) => {
        const [year, month, day] = date.split("-");
        return `${month}-${day}-${year}`;
    };

    const parseXML = (xmlText: string): Product[] => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const items = xmlDoc.getElementsByTagName("SoldProductsInfo")[0].children;

        return Array.from(items).map((item) => ({
            id: item.querySelector("id")?.textContent || "",
            productType: item.querySelector("productType")?.textContent || "",
            brand: item.querySelector("brand")?.textContent || "",
            model: item.querySelector("model")?.textContent || "",
            price: parseFloat(item.querySelector("price")?.textContent?.replace(",", ".") || "0"),
            soldNum: parseInt(item.querySelector("soldNum")?.textContent || "0"),
            revenue: parseFloat(item.querySelector("revenue")?.textContent || "0"),
            remains: parseInt(item.querySelector("remains")?.textContent || "0"),
            stockDate: item.querySelector("stockDate")?.textContent || "",
            totalOnStock: parseInt(item.querySelector("totalOnStock")?.textContent || "0"),
            soldCount: parseInt(item.querySelector("soldCount")?.textContent || "0"),
            remaining: parseInt(item.querySelector("remaining")?.textContent || "0"),
            stockFromDate: parseInt(item.querySelector("stockFromDate")?.textContent || "0"),
            stockToEndDate: parseInt(item.querySelector("stockToEndDate")?.textContent || "0"),
            displaySize: parseFloat(item.querySelector("displaySize")?.textContent || "0"),
            maxResolutions: item.querySelector("maxResolutions")?.textContent || "",
            color: item.querySelector("color")?.textContent || "",
            refreshRate: item.querySelector("refreshRate")?.textContent || "",
            displayTech: item.querySelector("displayTech")?.textContent || "",
            pixelResolutions: item.querySelector("pixelResolutions")?.textContent || "",
            output: item.querySelector("output")?.textContent || "",
            speaker: item.querySelector("speaker")?.textContent || "",
            wirelessConnections: item.querySelector("wirelessConnections")?.textContent || "",
            bluetooth: item.querySelector("bluetooth")?.textContent || "",
            connections: item.querySelector("connections")?.textContent || "",
            smart: item.querySelector("smart")?.textContent || "",
            os: item.querySelector("os")?.textContent || "",
            vesa: item.querySelector("vesa")?.textContent || "",
            productionYear: parseInt(item.querySelector("productionYear")?.textContent || "0"),

        }));
    };


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
                        <i className="bi bi-projector mr-4"></i> Stock information from start date to end date
                    </h1>
                </div>


                <div className="w-full px-1 mt-20">
                    <div className="w-full bg-white shadow-xl rounded-lg px-8 py-6">
                        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-blue-100 text-blue-700 font-semibold uppercase text-sm">
                            <tr>
                                <th className="py-3 px-5 text-left" colSpan={8}>Device Tech Infromation + Stock Information</th>
                                <th className="py-3 px-12 text-left">
                                    <div className="flex items-center">
                                        <span className="text-xs font-semibold mr-3">Start Date:</span>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-29 px-3 py-1 text-sm text-gray-900 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"/>
                                    </div>
                                </th>
                                <th className="py-3 px-3 text-left">
                                    <div className="flex items-center">
                                        <span className="text-xs font-semibold mr-2">End Date:</span>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-29 px-3 py-1 text-sm text-gray-900 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"/>
                                    </div>
                                </th>
                                <th className="py-3 px-3 text-right">
                                    <div className="flex items-center justify-end">
                                        <span className="text-xs font-semibold mr-2">Search:</span>
                                        <input
                                            type="text"
                                            placeholder="Search by ID, or Model ..."
                                            className="bg-white text-gray-900 rounded-lg text-left px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 w-32 sm:w-60"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </th>
                            </tr>
                            </thead>
                            <thead className="bg-gray-700 text-white font-semibold uppercase text-sm">
                            <tr>
                                <th className="py-3 px-5 text-left" colSpan={6}>Details</th>
                                <th className="py-3 px-3 text-left">
                                    <div className="flex items-center">
                                        <span className="text-xs font-semibold mr-2">TYPE:</span>
                                        <select
                                            value={productType}
                                            onChange={(e) => setProductType(e.target.value)}
                                            className="w-29 px-3 py-1 text-sm text-gray-900 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                        >
                                            <option value="All">All</option>
                                            <option value="Monitor">Monitor</option>
                                            <option value="Television">Television</option>
                                            <option value="Projector">Projector</option>
                                        </select>
                                    </div>
                                </th>
                                <th className="py-3 px-3 text-left">
                                    <div className="flex items-center">
                                        <span className="text-xs font-semibold mr-2">RESOLUTIONS:</span>
                                        <select
                                            value={maxResolutionsFilter}
                                            onChange={(e) => setMaxResolutionsFilter(e.target.value)}
                                            className="w-29 px-3 py-1 text-sm text-gray-900 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                        >
                                            <option value="">Select Resolution</option>
                                            {getMaxResolutionOptions().map((resolution) => (
                                                <option key={resolution} value={resolution}>
                                                    {resolution}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </th>
                                <th className="py-3 px-12 text-left">
                                    <div className="flex items-center">
                                        <span className="text-xs font-semibold mr-3">DISPLAY SIZE:</span>
                                        <input
                                            type="text"
                                            placeholder="Display Size (e.g., 24)"
                                            value={displaySizeFilter} onChange={(e) => setDisplaySizeFilter(e.target.value)}
                                            className="w-29 px-3 py-1 text-sm text-gray-900 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"/>
                                    </div>
                                </th>

                                <th className="py-3 px-3 text-left">
                                    <div className="flex items-center">
                                        <span className="text-xs font-semibold mr-2">SORT BY PRIZE:</span>
                                        <select
                                            value={priceSortOrder}
                                            onChange={(e) => setPriceSortOrder(e.target.value as "asc" | "desc" | "")}
                                            className="w-29 px-3 py-1 text-sm text-gray-900 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                        >
                                            <option value="">Sort by Price</option>
                                            <option value="asc">Price Ascending</option>
                                            <option value="desc">Price Descending</option>
                                        </select>
                                    </div>
                                </th>
                                <th className="py-3 px-3 text-left">
                                    <div className="flex items-center">
                                        <span className="text-xs font-semibold mr-2">SORT BY DISPLAY SIZE:</span>
                                        <select
                                            value={displaySizeSortOrder}
                                            onChange={(e) => setDisplaySizeSortOrder(e.target.value as "asc" | "desc" | "")}
                                            className="w-29 px-3 py-1 text-sm text-gray-900 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                        >
                                            <option value="">Sort by Display Size</option>
                                            <option value="asc">Display Size Ascending</option>
                                            <option value="desc">Display Size Descending</option>
                                        </select>
                                    </div>
                                </th>
                            </tr>
                            </thead>
                        </table>

                        <div className="w-full bg-white shadow-xl rounded-lg px-8 py-6">
                            {/* Warning Message */}
                            {(!startDate || !endDate) && (
                                <div className="py-6 px-4 bg-yellow-100 border border-yellow-500 text-yellow-700 rounded-md text-center">
                                    Warning! Please select both <strong>Start Date</strong> and <strong>End Date</strong> before proceeding!
                                </div>
                            )}

                            {/* Date Summary Message */}
                            {startDate && endDate && (
                                <div className="py-6 px-4 bg-green-100 border border-green-500 text-green-700 rounded-md text-center mt-2">
                                    Records from <strong>{formatDate(startDate)}</strong> to <strong>{formatDate(endDate)}</strong>
                                </div>
                            )}

                            {/* Hide Button (Appears when all records are shown) */}
                            {showAll && (
                                <div className="flex justify-center mt-4">
                                    <div className="flex flex-col items-center cursor-pointer text-black hover:text-black transition" onClick={() => setShowAll(false)}>
                                        <span className="text-gray-400 text-center">Hide Records</span>
                                        <i className="bi bi-arrow-up-circle-fill text-2xl"></i>
                                    </div>
                                </div>
                            )}

                            {/* Grid Container */}
                            <div className="relative w-full mt-10 px-6">
                                {/* Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {filteredProducts.slice(0, showAll ? filteredProducts.length : 4).map((p, index) => (
                                        <div key={index} className="bg-gray-200 border rounded-lg shadow-md p-4">
                                            <h5 className="text-lg font-bold">{p.productType}</h5>
                                            <p className="text-gray-700 text-sm"><strong>ID:</strong> {p.id}</p>

                                            {/* Detail Information */}
                                            <div className="bg-white mt-4 rounded-lg shadow-inner">
                                                <div className="bg-gray-700 text-white flex justify-between items-center p-2 rounded-t-lg">
                                                    <span className="text-sm">Detail Information</span>
                                                </div>
                                                <div className="p-4">
                                                    <p className="text-gray-700 text-sm"><strong>Brand:</strong> {p.brand}</p>
                                                    <p className="text-gray-700 text-sm"><strong>Model:</strong> {p.model}</p>
                                                    <p className="text-gray-700 text-sm"><strong>Price:</strong> ${p.price}</p>
                                                    <p className="text-gray-700 text-sm"><strong>Stock Date:</strong>{" "}{p.stockDate}</p>
                                                </div>

                                                {/* Additional details (only visible when showAll is true) */}
                                                {showAll && (
                                                    <div className="bg-white mt-4 rounded-lg shadow-inner">
                                                        <div className="bg-gray-700 text-white flex justify-between items-center p-2 rounded-t-lg">
                                                            <span className="text-sm">Display Information</span>
                                                        </div>
                                                        <div className="p-4">
                                                            <p className="text-gray-700 text-sm"><strong>Display Size:</strong> {p.displaySize}</p>
                                                            <p className="text-gray-700 text-sm"><strong>Refresh Rate:</strong> {p.refreshRate}</p>
                                                            <p className="text-gray-700 text-sm"><strong>Display Technology:</strong> {p.displayTech}</p>
                                                            <p className="text-gray-700 text-sm"><strong>Pixel Resolution:</strong> {p.pixelResolutions}</p>
                                                            <p className="text-gray-700 text-sm"><strong>Max Resolution:</strong> {p.maxResolutions}</p>
                                                        </div>
                                                        <div className="bg-gray-700 text-white flex justify-between items-center p-2 rounded-t-lg">
                                                            <span className="text-sm">Connectivity</span>
                                                        </div>
                                                        <div className="p-4">
                                                            <p className="text-gray-700 text-sm"><strong>Outputs:</strong> {p.output} </p>
                                                            <p className="text-gray-700 text-sm"><strong>Speaker:</strong> {p.speaker} </p>
                                                            <p className="text-gray-700 text-sm"><strong>Wireless Connectivity:</strong> {p.wirelessConnections} </p>
                                                            <p className="text-gray-700 text-sm"><strong>Bluetooth:</strong> {p.bluetooth} </p>
                                                            <p className="text-gray-700 text-sm"><strong>Connectivity:</strong> {p.connections} </p>
                                                            <p className="text-gray-700 text-sm"><strong>Smart:</strong> {p.smart} </p>
                                                            <p className="text-gray-700 text-sm"><strong>OS:</strong> {p.os} </p>
                                                            <p className="text-gray-700 text-sm"><strong>VESA:</strong> {p.vesa} </p>
                                                        </div>
                                                        <div className="bg-gray-700 text-white flex justify-between items-center p-2 rounded-t-lg">
                                                            <span className="text-sm">Additional Informations</span>
                                                        </div>
                                                        <div className="p-4">
                                                            <p className="text-gray-700 text-sm"><strong>Color:</strong> {p.color} </p>
                                                            <p className="text-gray-700 text-sm"><strong>Production Year:</strong> {p.productionYear} </p>
                                                            <p className="text-gray-700 text-sm"><strong>Stock Date:</strong> {p.stockDate} </p>
                                                            <p className="text-gray-700 text-sm"><strong>Price:</strong> ${p.price} </p>
                                                        </div>
                                                        <div className="bg-gray-700 text-white flex justify-between items-center p-2 rounded-t-lg">
                                                            <span className="text-sm">Stock Informations</span>
                                                        </div>
                                                        <div className="p-4">
                                                            <p className="text-gray-700 text-sm"><strong>Total Initial Stock:</strong> {p.totalOnStock}</p>
                                                            <p className="text-gray-700 text-sm"><strong>Total Current Stock:</strong> {p.remains}</p>
                                                            <p className="text-gray-700 text-sm"><strong>Total Sold:</strong> {p.soldNum}</p>
                                                            <p className="text-gray-700 text-sm"><strong>Stock Date:</strong>{" "} {p.stockDate}</p>
                                                            <p className="text-gray-700 text-sm"><strong>Sold (Period):</strong> {p.soldCount}</p>
                                                            <p className="text-gray-700 text-sm"><strong>Remaining (Period):</strong> {p.remaining}</p>
                                                            <p className="text-gray-700 text-sm"><strong>Stock From: </strong> {p.stockFromDate}</p>
                                                            <p className="text-gray-700 text-sm"><strong>Stock To: </strong> {p.stockToEndDate}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Show "..." only if collapsed */}
                                                {!showAll && <p className="text-gray-500 text-center font-bold">...</p>}
                                            </div>


                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Show "..." Indicator if not all items are visible */}
                            {!showAll && filteredProducts.length > 4 && (
                                <div className="flex justify-center items-center w-full mt-4">
                                    <span className="text-gray-500 text-2xl font-bold">...</span>
                                </div>
                            )}

                            {/* Reveal/Hide Icon */}
                            <div className="flex justify-center mt-6">
                                <div
                                    className={`flex flex-col items-center cursor-pointer transition ${showAll ? "text-black hover:text-black" : "text-black hover:text-black"}`}
                                    onClick={() => setShowAll(!showAll)}
                                >
                                    <i className={`bi ${showAll ? "bi-arrow-up-circle-fill" : "bi-arrow-down-circle-fill"} text-2xl`}></i>
                                    <span className="text-gray-400 text-center">
                                    {showAll ? "Hide Details" : "Reveal Details"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Summary Data Table - Always Visible */}
                <div className="w-full flex flex-col items-center lg:items-start justify-center px-4 mt-10">
                    <div className="w-full bg-white shadow-xl rounded-lg px-8 py-6 mt-6">
                        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-blue-100 text-blue-700 font-semibold uppercase text-sm">
                            <tr>
                                <th className="py-3 px-5 text-left" colSpan={8}>Model Summary</th>
                            </tr>
                            </thead>
                            <thead className="bg-gray-700 text-white font-semibold uppercase text-sm">
                            <tr>
                                <th className="py-3 px-6 text-left">Brand</th>
                                <th className="py-3 px-5 text-left">Type</th>
                                <th className="py-3 px-5 text-center">Model</th>
                                <th className="py-3 px-5 text-center">Initial Stock</th>
                                <th className="py-3 px-5 text-center">Current Sold</th>
                                <th className="py-3 px-5 text-center">Remaining</th>
                                <th className="py-3 px-5 text-center">Stock from {startDate || "yyyy/mm/dd"}</th>
                                <th className="py-3 px-5 text-center">Stock to {endDate || "yyyy/mm/dd"}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredSummaryData.length > 0 ? (
                                filteredSummaryData.map((brand, brandIndex) => (
                                    <React.Fragment key={brandIndex}>
                                        {brand.models.map((model, modelIndex) => (
                                            <tr key={modelIndex} className="hover:bg-blue-50 even:bg-gray-50">
                                                <td className="py-3 px-5 text-gray-900 border-b border-gray-200">{brand.brandName}</td>
                                                <td className="py-3 px-5 text-gray-900 border-b border-gray-200">{model.productType}</td>
                                                <td className="py-3 px-5 text-center text-gray-900 border-b border-gray-200">{model.modelName}</td>
                                                <td className="py-3 px-5 text-center text-gray-900 border-b border-gray-200">{model.totalStock}</td>
                                                <td className="py-3 px-5 text-center text-gray-900 border-b border-gray-200">{model.totalSold}</td>
                                                <td className="py-3 px-5 text-center text-gray-900 border-b border-gray-200">{model.remaining}</td>
                                                <td className="py-3 px-5 text-center text-gray-900 border-b border-gray-200">{model.stockFromDate || "N/A"}</td>
                                                <td className="py-3 px-5 text-center text-gray-900 border-b border-gray-200">{model.stockToEndDate || "N/A"}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                                        No data available. Please select a date range to load data.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockInfo;
