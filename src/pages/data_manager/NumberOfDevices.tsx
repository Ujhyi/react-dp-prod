import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../configuration/Config.tsx";

interface Product {
    id: string;
    productType: string;
    price: number;
    soldNum: number;
    revenue: number;
    remains: number;
    brand: string;
    model: string;
    stockDate: string;
    totalOnStock: number;
    soldCount: number;
    remaining: number;
    stockFromDate: number;
    stockToEndDate: number;
}

interface ProductCount {
    productType: string;
    count: string;
}

interface DeviceCounts {
    ProductCount: ProductCount[];
    TotalCount: string;
}

interface SummaryData {
    periodMonitorSum: number;
    periodTelevisionSum: number;
    periodProjectorSum: number;
    totalPeriodSum: number;
    initialMonitorStock: number;
    initialTelevisionStock: number;
    initialProjectorStock: number;
    totalInitialStock: number;
    currentMonitorStock: number;
    currentTelevisionStock: number;
    currentProjectorStock: number;
    currentTotalStock: number;
    stockFromStartMonitor: number;
    stockFromStartTelevision: number;
    stockFromStartProjector: number;
    stockToEndMonitor: number;
    stockToEndTelevision: number;
    stockToEndProjector: number;
    totalStockFromStart: number;
    totalStockToEnd: number;
}

const StockInfo: React.FC = () => {
    const [deviceCounts, setDeviceCounts] = useState<DeviceCounts | null>(null);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [productType, setProductType] = useState<string>("All");
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortBy, ] = useState<"price" | "">("price");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [showAll, setShowAll] = useState<boolean>(false);
    const [summaryData, setSummaryData] = useState<SummaryData | null>(null);


    const countDevicesUrl = `${API_BASE_URL}/CountDevices`;

    useEffect(() => {
        fetchDeviceCounts();
    }, []);

    const fetchDeviceCounts = async () => {
        try {
            const response = await fetch(countDevicesUrl, {
                method: "POST",
                headers: { "Content-Type": "text/xml" }
            });
            const xmlText = await response.text();
            processDeviceCounts(xmlText);
        } catch (error) {
            console.error("Error fetching device counts:", error);
        }
    };

    const processDeviceCounts = (xml: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");

        const counts: ProductCount[] = [];
        xmlDoc.querySelectorAll("ProductCount").forEach((product) => {
            counts.push({
                productType: product.querySelector("ProductType")?.textContent || "",
                count: product.querySelector("Count")?.textContent || "0",
            });
        });

        setDeviceCounts({
            ProductCount: counts,
            TotalCount: xmlDoc.querySelector("TotalCount")?.textContent || "0",
        });
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetchData();
        }
    }, [startDate, endDate, productType]);

    useEffect(() => {
        filterAndSortData();
    }, [searchQuery, sortBy, sortOrder]);

    const fetchData = async () => {
        try {
            const params = new URLSearchParams();
            params.append("startDate", formatDate(startDate));
            params.append("endDate", formatDate(endDate));
            params.append("productTypeFilter", productType);
            params.append("sortOrder", sortOrder);

            const response = await axios.post(
                "http://localhost:51834/WebService.asmx/GetStockInformation_StartToEnd_NOD",
                params,
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                }
            );

            const { products, summary } = parseXML(response.data);
            setAllProducts(products);
            setFilteredProducts(products);
            setSummaryData(summary);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const filterAndSortData = () => {
        let filtered = allProducts.filter((p) =>
            productType === "All" || p.productType === productType
        );

        if (searchQuery) {
            filtered = filtered.filter(
                (p) =>
                    p.id.includes(searchQuery) ||
                    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.model.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (sortBy === "price") {
            filtered.sort((a, b) =>
                sortOrder === "asc" ? a.price - b.price : b.price - a.price
            );
        }

        setFilteredProducts(filtered);
    };

    const formatDate = (date: string) => {
        const [year, month, day] = date.split("-");
        return `${month}-${day}-${year}`;
    };

    const parseXML = (xmlText: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const items = xmlDoc.getElementsByTagName("SoldProductsInfo")[0].children;
        const summaryNode = xmlDoc.getElementsByTagName("Summary")[0];

        const products: Product[] = Array.from(items)
            .filter((item) => item.nodeName !== "Summary")
            .map((item) => ({
                id: item.querySelector("id")?.textContent || "",
                productType: item.querySelector("productType")?.textContent || "",
                price: parseFloat(item.querySelector("price")?.textContent?.replace(",", ".") || "0"),
                soldNum: parseInt(item.querySelector("soldNum")?.textContent || "0"),
                revenue: parseFloat(item.querySelector("revenue")?.textContent || "0"),
                remains: parseInt(item.querySelector("remains")?.textContent || "0"),
                brand: item.querySelector("brand")?.textContent || "",
                model: item.querySelector("model")?.textContent || "",
                stockDate: item.querySelector("stockDate")?.textContent || "",
                totalOnStock: parseInt(item.querySelector("totalOnStock")?.textContent || "0"),
                soldCount: parseInt(item.querySelector("soldCount")?.textContent || "0"),
                remaining: parseInt(item.querySelector("remaining")?.textContent || "0"),
                stockFromDate: parseInt(item.querySelector("stockFromDate")?.textContent || "0"),
                stockToEndDate: parseInt(item.querySelector("stockToEndDate")?.textContent || "0"),
            }));

        const summary: SummaryData = {
            periodMonitorSum: parseInt(summaryNode.querySelector("PeriodMonitorSum")?.textContent || "0"),
            periodTelevisionSum: parseInt(summaryNode.querySelector("PeriodTelevisionSum")?.textContent || "0"),
            periodProjectorSum: parseInt(summaryNode.querySelector("PeriodProjectorSum")?.textContent || "0"),
            totalPeriodSum: parseInt(summaryNode.querySelector("TotalPeriodSum")?.textContent || "0"),
            initialMonitorStock: parseInt(summaryNode.querySelector("InitialMonitorStock")?.textContent || "0"),
            initialTelevisionStock: parseInt(summaryNode.querySelector("InitialTelevisionStock")?.textContent || "0"),
            initialProjectorStock: parseInt(summaryNode.querySelector("InitialProjectorStock")?.textContent || "0"),
            totalInitialStock: parseInt(summaryNode.querySelector("TotalInitialStock")?.textContent || "0"),
            currentMonitorStock: parseInt(summaryNode.querySelector("CurrentMonitorStock")?.textContent || "0"),
            currentTelevisionStock: parseInt(summaryNode.querySelector("CurrentTelevisionStock")?.textContent || "0"),
            currentProjectorStock: parseInt(summaryNode.querySelector("CurrentProjectorStock")?.textContent || "0"),
            currentTotalStock: parseInt(summaryNode.querySelector("CurrentTotalStock")?.textContent || "0"),
            stockFromStartMonitor: parseInt(summaryNode.querySelector("StockFromStartMonitor")?.textContent || "0"),
            stockFromStartTelevision: parseInt(summaryNode.querySelector("StockFromStartTelevision")?.textContent || "0"),
            stockFromStartProjector: parseInt(summaryNode.querySelector("StockFromStartProjector")?.textContent || "0"),
            stockToEndMonitor: parseInt(summaryNode.querySelector("StockToEndMonitor")?.textContent || "0"),
            stockToEndTelevision: parseInt(summaryNode.querySelector("StockToEndTelevision")?.textContent || "0"),
            stockToEndProjector: parseInt(summaryNode.querySelector("StockToEndProjector")?.textContent || "0"),
            totalStockFromStart: parseInt(summaryNode.querySelector("TotalStockFromStart")?.textContent || "0"),
            totalStockToEnd: parseInt(summaryNode.querySelector("TotalStockToEnd")?.textContent || "0"),

        };

        return { products, summary };
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

                {/* Table Container */}
                <div className="w-full flex flex-col items-center lg:items-start justify-center px-4 mt-20">
                    {deviceCounts && deviceCounts.ProductCount && (
                        <div className="w-full bg-white shadow-xl rounded-lg px-8 py-6">
                            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                                {/* Table Header */}
                                <thead className="bg-blue-100 text-blue-700 font-semibold uppercase text-sm">
                                <tr>
                                    <th className="py-3 px-5 text-left" colSpan={5}>
                                        COUNT OF EACH PRODUCT TYPE MODELS
                                    </th>
                                </tr>
                                </thead>

                                {/* Column Headers */}
                                <thead className="bg-gray-700 text-white font-semibold uppercase text-sm">
                                <tr>
                                    <th className="py-4 px-5 text-left w-1/2">Product Type</th>
                                    <th className="py-4 px-5 text-center w-1/2">COUNT</th>
                                </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody>
                                {deviceCounts.ProductCount.map((device: ProductCount, index: number) => (
                                    <tr key={index} className="hover:bg-blue-50 even:bg-gray-50">
                                        <td className="py-3 px-5 text-gray-800 border-b">{device.productType}</td>
                                        <td className="py-3 px-5 text-center text-gray-900 border-b">{device.count}</td>
                                    </tr>
                                ))}
                                <tr className="bg-blue-100 font-bold text-blue-700">
                                    <td className="py-3 px-5 border-t">TOTAL COUNT</td>
                                    <td className="py-3 px-5 text-center border-t">{deviceCounts.TotalCount}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
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

                                <th className="py-3 px-3 text-left">
                                    <div className="flex items-center">
                                        <span className="text-xs font-semibold mr-2">Filter:</span>
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
                                        <span className="text-xs font-semibold mr-2">Filter:</span>
                                        <select
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                                            className="w-29 px-3 py-1 text-sm text-gray-900 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                        >
                                            <option value="asc">Price Ascending</option>
                                            <option value="desc">Price Descending</option>
                                        </select>
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


                <div className="w-full flex flex-col items-center lg:items-start justify-center px-4">
                    <div className="w-full bg-white shadow-xl rounded-lg px-8 py-6 mt-6">
                        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-blue-100 text-blue-700 font-semibold uppercase text-sm">
                            <tr>
                                <th className="py-3 px-5 text-left" colSpan={6}>STOCK SUMMARY</th>
                            </tr>
                            </thead>
                            <thead className="bg-gray-700 text-white font-semibold uppercase text-sm">
                            <tr>
                                <th className="py-3 px-5 text-left">Type</th>
                                <th className="py-3 px-5 text-center">Initial Stock</th>
                                <th className="py-3 px-5 text-center">Current Stock</th>
                                <th className="py-3 px-5 text-center">Sold Sum (Period)</th>
                                <th className="py-3 px-5 text-center">Stock from Start</th>
                                <th className="py-3 px-5 text-center">Stock to End</th>
                            </tr>
                            </thead>
                            <tbody>
                            {summaryData ? (
                                <>
                                    {/* Monitor Row */}
                                    <tr className="hover:bg-blue-50 even:bg-gray-50">
                                        <td className="py-3 px-5 text-gray-800 border-b">Monitor</td>
                                        <td className="py-3 px-5 text-center border-b">{summaryData.initialMonitorStock}</td>
                                        <td className="py-3 px-5 text-center border-b">{summaryData.currentMonitorStock}</td>
                                        <td className="py-3 px-5 text-center border-b">{summaryData.periodMonitorSum}</td>
                                        <td className="py-3 px-5 text-center border-b">{summaryData.stockFromStartMonitor}</td>
                                        <td className="py-3 px-5 text-center border-b">{summaryData.stockToEndMonitor}</td>
                                    </tr>

                                    {/* Television Row */}
                                    <tr className="hover:bg-blue-50 even:bg-gray-50">
                                        <td className="py-3 px-5 text-gray-800 border-b">Television</td>
                                        <td className="py-3 px-5 text-center border-b">{summaryData.initialTelevisionStock}</td>
                                        <td className="py-3 px-5 text-center border-b">{summaryData.currentTelevisionStock}</td>
                                        <td className="py-3 px-5 text-center border-b">{summaryData.periodTelevisionSum}</td>
                                        <td className="py-3 px-5 text-center border-b">{summaryData.stockFromStartTelevision}</td>
                                        <td className="py-3 px-5 text-center border-b">{summaryData.stockToEndTelevision}</td>
                                    </tr>

                                    {/* Projector Row */}
                                    <tr className="hover:bg-blue-50 even:bg-gray-50">
                                        <td className="py-3 px-5 text-gray-800 border-b">Projector</td>
                                        <td className="py-3 px-5 text-center border-b">{summaryData.initialProjectorStock}</td>
                                        <td className="py-3 px-5 text-center border-b">{summaryData.currentProjectorStock}</td>
                                        <td className="py-3 px-5 text-center border-b">{summaryData.periodProjectorSum}</td>
                                        <td className="py-3 px-5 text-center border-b">{summaryData.stockFromStartProjector}</td>
                                        <td className="py-3 px-5 text-center border-b">{summaryData.stockToEndProjector}</td>
                                    </tr>

                                    {/* Total Summary Row */}
                                    <tr className="bg-blue-100 font-bold text-blue-700">
                                        <td className="py-3 px-5 border-t">TOTAL</td>
                                        <td className="py-3 px-5 text-center border-t">{summaryData.totalInitialStock}</td>
                                        <td className="py-3 px-5 text-center border-t">{summaryData.currentTotalStock}</td>
                                        <td className="py-3 px-5 text-center border-t">{summaryData.totalPeriodSum}</td>
                                        <td className="py-3 px-5 text-center border-t">{summaryData.totalStockFromStart}</td>
                                        <td className="py-3 px-5 text-center border-t">{summaryData.totalStockToEnd}</td>
                                    </tr>
                                </>
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-4 text-gray-500">
                                        No data available. Please select a date range.
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
