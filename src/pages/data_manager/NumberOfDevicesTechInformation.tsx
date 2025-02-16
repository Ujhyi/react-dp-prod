import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../configuration/Config.tsx";
import { StockData } from "../../interfaces/stockData";

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


const NumberOfDevicesTechInformation: React.FC = () => {
    const countDeviceByDateDetailTech1 = `${API_BASE_URL}/GetStockInformation_StartDateToEndDate_1`;
    const countDeviceByDateDetailTech2 = `${API_BASE_URL}/GetStockInformation_StartDateToEndDate_2`;

    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [, setSummary] = useState<Brand[]>([]);
    const [filteredSummaryData, setFilteredSummaryData] = useState<Brand[]>([]);
    const [stockData, setStockData] = useState<StockData[]>([]);
    const [filteredStockData, setFilteredStockData] = useState<StockData[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>(""); //



    useEffect(() => {
        if (startDate && endDate) {
            fetchStockData();
            fetchSummaryData();
        }
    }, [startDate, endDate]);

    // Handle search input
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredStockData(stockData);
            return;
        }
        const filteredResults = stockData.filter((product) =>
            product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredStockData(filteredResults);
    }, [searchQuery, stockData]);

    const fetchStockData = async () => {
        const formattedStartDate = convertDateFormat(startDate);
        const formattedEndDate = convertDateFormat(endDate);

        const body = new URLSearchParams();
        body.append("startDate", formattedStartDate);
        body.append("endDate", formattedEndDate);

        try {
            const response = await fetch(countDeviceByDateDetailTech1, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: body.toString(),
            });

            const xmlText = await response.text();
            const parsedData = parseStockXmlData(xmlText);
            setStockData(parsedData);
            setFilteredStockData(parsedData);
        } catch (error) {
            console.error("Error fetching stock data:", error);
        }
    };

    const fetchSummaryData = async () => {
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

    const parseStockXmlData = (xmlData: string): StockData[] => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, "text/xml");
        const products = [
            ...Array.from(xmlDoc.getElementsByTagName("Monitor")),
            ...Array.from(xmlDoc.getElementsByTagName("Television")),
            ...Array.from(xmlDoc.getElementsByTagName("Projector"))
        ];

        return products.map((product) => {
            const obj: Partial<StockData> = {};
            Array.from(product.childNodes).forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const key = node.nodeName as keyof StockData;
                    obj[key] = node.textContent || "";
                }
            });
            return obj as StockData;
        });
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
    const formatDate = (date: string): string => {
        return new Date(date)
            .toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })
            .replace(/\//g, "-");
    };

    const convertDateFormat = (date: string): string => {
        const [year, month, day] = date.split("-");
        return `${month}-${day}-${year}`;
    };

    const [collapsed, setCollapsed] = useState(
        localStorage.getItem("sidebarCollapsed") === "true"
    );
    const [showAll, setShowAll] = useState<boolean>(false);


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
                    <h1 className="text-2xl font-bold text-white flex items-center"><i className="bi bi-journal-code mr-4"></i> Number of Devices + Detail Tech Information
                    </h1>
                </div>

                <div className="w-full px-1 mt-20">
                    <div className="w-full bg-white shadow-xl rounded-lg px-8 py-6">
                        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-blue-100 text-blue-700 font-semibold uppercase text-sm">
                            <tr>
                                <th className="py-3 px-5 text-left" colSpan={6}>Devices Counts Summary</th>
                            </tr>
                            </thead>
                            <thead className="bg-gray-700 text-white font-semibold uppercase text-sm">
                            <tr>
                                <th className="py-3 px-5 text-left">Details</th>
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
                                            placeholder="Search by ID, Model, or Brand..."
                                            className="bg-white text-gray-900 rounded-lg text-left px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 w-32 sm:w-60"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
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
                                    {filteredStockData.slice(0, showAll ? filteredStockData.length : 4).map((product, index) => (
                                        <div key={index} className="bg-gray-200 border rounded-lg shadow-md p-4">
                                            <h5 className="text-lg font-bold">{product.productType}</h5>
                                            <p className="text-gray-700 text-sm"><strong>ID:</strong> {product.id}</p>

                                            {/* Detail Information */}
                                            <div className="bg-white mt-4 rounded-lg shadow-inner">
                                                <div className="bg-gray-700 text-white flex justify-between items-center p-2 rounded-t-lg">
                                                    <span className="text-sm">Detail Information</span>
                                                </div>
                                                <div className="p-4">
                                                    <p className="text-gray-700 text-sm"><strong>Brand:</strong> {product.brand}</p>
                                                    <p className="text-gray-700 text-sm"><strong>Model:</strong> {product.model}</p>
                                                    <p className="text-gray-700 text-sm"><strong>Price:</strong> {product.price}</p>
                                                    <p className="text-gray-700 text-sm"><strong>Stock Date:</strong> {product.stockDate}</p>
                                                </div>

                                                    {/* Additional details (only visible when showAll is true) */}
                                                    {showAll && (
                                                        <div className="bg-white mt-4 rounded-lg shadow-inner">
                                                            <div className="bg-gray-700 text-white flex justify-between items-center p-2 rounded-t-lg">
                                                                <span className="text-sm">Display Information</span>
                                                            </div>
                                                            <div className="p-4">
                                                                <p className="text-gray-700 text-sm"><strong>Display Size:</strong> {product.displaySize}</p>
                                                                <p className="text-gray-700 text-sm"><strong>Refresh Rate:</strong> {product.refreshRate}</p>
                                                                <p className="text-gray-700 text-sm"><strong>Display Technology:</strong> {product.displayTech}</p>
                                                                <p className="text-gray-700 text-sm"><strong>Pixel Resolution:</strong> {product.pixelResolutions}</p>
                                                                <p className="text-gray-700 text-sm"><strong>Max Resolution:</strong> {product.maxResolutions}</p>
                                                            </div>

                                                            <div className="bg-gray-700 text-white flex justify-between items-center p-2 rounded-t-lg">
                                                                <span className="text-sm">Connectivity</span>
                                                            </div>
                                                            <div className="p-4">
                                                                <p className="text-gray-700 text-sm"><strong>Outputs:</strong> {product.output} </p>
                                                                <p className="text-gray-700 text-sm"><strong>Speaker:</strong> {product.speaker} </p>
                                                                <p className="text-gray-700 text-sm"><strong>Wireless Connectivity:</strong> {product.wirelessConnections} </p>
                                                                <p className="text-gray-700 text-sm"><strong>Bluetooth:</strong> {product.bluetooth} </p>
                                                                <p className="text-gray-700 text-sm"><strong>Connectivity:</strong> {product.connections} </p>
                                                                <p className="text-gray-700 text-sm"><strong>Smart:</strong> {product.smart} </p>
                                                                <p className="text-gray-700 text-sm"><strong>OS:</strong> {product.os} </p>
                                                                <p className="text-gray-700 text-sm"><strong>VESA:</strong> {product.vesa} </p>
                                                            </div>

                                                            <div className="bg-gray-700 text-white flex justify-between items-center p-2 rounded-t-lg">
                                                                <span className="text-sm">Additional Informations</span>
                                                            </div>
                                                            <div className="p-4">
                                                                <p className="text-gray-700 text-sm"><strong>Color:</strong> {product.color} </p>
                                                                <p className="text-gray-700 text-sm"><strong>Production Year:</strong> {product.productionYear} </p>
                                                                <p className="text-gray-700 text-sm"><strong>Stock Date:</strong> {product.stockDate} </p>
                                                                <p className="text-gray-700 text-sm"><strong>Price:</strong> ${product.price} </p>
                                                            </div>

                                                            <div className="bg-gray-700 text-white flex justify-between items-center p-2 rounded-t-lg">
                                                                <span className="text-sm">Stock Informations</span>
                                                            </div>
                                                            <div className="p-4">
                                                                <p className="text-gray-700 text-sm"><strong>Total Initial Stock:</strong> {product.totalOnStock}</p>
                                                                <p className="text-gray-700 text-sm"><strong>Total Current Stock:</strong> {product.remains}</p>
                                                                <p className="text-gray-700 text-sm"><strong>Total Sold:</strong> {product.soldNum}</p>
                                                                <p className="text-gray-700 text-sm"><strong>Stock Date:</strong>{" "} {product.stockDate}</p>
                                                                <p className="text-gray-700 text-sm"><strong>Sold (Period):</strong> {product.soldCount}</p>
                                                                <p className="text-gray-700 text-sm"><strong>Remaining (Period):</strong> {product.remaining}</p>
                                                                <p className="text-gray-700 text-sm"><strong>Stock From: </strong> {product.stockFromDate}</p>
                                                                <p className="text-gray-700 text-sm"><strong>Stock To: </strong> {product.stockToEndDate}</p>
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
                            {!showAll && filteredStockData.length > 4 && (
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

export default NumberOfDevicesTechInformation;


