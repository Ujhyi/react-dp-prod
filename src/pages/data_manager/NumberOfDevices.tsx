import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../configuration/Config.tsx";



interface SummaryData {
    periodMonitorSum: string;
    periodTelevisionSum: string;
    periodProjectorSum: string;
    totalPeriodSum: string;
    initialMonitorStock: string;
    initialTelevisionStock: string;
    initialProjectorStock: string;
    totalInitialStock: string;
    currentMonitorStock: string;
    currentTelevisionStock: string;
    currentProjectorStock: string;
    currentTotalStock: string;
    stockFromStartMonitor: string;
    stockFromStartTelevision: string;
    stockFromStartProjector: string;
    stockToEndMonitor: string;
    stockToEndTelevision: string;
    stockToEndProjector: string;
    totalStockFromStart: string;
    totalStockToEnd: string;
}

interface ProductCount {
    productType: string;
    count: string;
}

interface DeviceCounts {
    ProductCount: ProductCount[];
    TotalCount: string;
}

const NumberOfDevices: React.FC = () => {
    const [summaryData, setSummaryData] = useState<SummaryData>({
        periodMonitorSum: "0",
        periodTelevisionSum: "0",
        periodProjectorSum: "0",
        totalPeriodSum: "0",
        initialMonitorStock: "0",
        initialTelevisionStock: "0",
        initialProjectorStock: "0",
        totalInitialStock: "0",
        currentMonitorStock: "0",
        currentTelevisionStock: "0",
        currentProjectorStock: "0",
        currentTotalStock: "0",
        stockFromStartMonitor: "0",
        stockFromStartTelevision: "0",
        stockFromStartProjector: "0",
        stockToEndMonitor: "0",
        stockToEndTelevision: "0",
        stockToEndProjector: "0",
        totalStockFromStart: "0",
        totalStockToEnd: "0",
    });

    const [deviceCounts, setDeviceCounts] = useState<DeviceCounts | null>(null);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [allStockData, setAllStockData] = useState<any[]>([]); // Stores original dataset
    const [filteredStockData, setFilteredStockData] = useState<any[]>([]); // Stores filtered dataset
    const [showAll, setShowAll] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const countDevicesUrl = `${API_BASE_URL}/CountDevices`;
    const countDeviceByDateUrl = `${API_BASE_URL}/GetStockInformation_StartDateToEndDate`;

    useEffect(() => {
        fetchDeviceCounts();
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            fetchCounter();
        }
    }, [startDate, endDate]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredStockData([...allStockData]); // Reset to original dataset
            return;
        }
        const filteredResults = allStockData.filter((product) =>
            (product.id && product.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (product.model && product.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        setFilteredStockData(filteredResults);
    }, [searchQuery, allStockData]);


    const fetchDeviceCounts = async () => {
        try {
            const response = await fetch(countDevicesUrl, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            const textResponse = await response.text();
            processDeviceCounts(textResponse);
        } catch (error) {
            console.error("Error fetching total sales revenue:", error);
            alert("An error occurred while fetching total sales revenue.");
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

    const fetchCounter = async () => {
        if (!startDate || !endDate) return;

        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        try {
            const response = await fetch(countDeviceByDateUrl, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ startDate: formattedStartDate, endDate: formattedEndDate }),

                //body: body.toString(),
            });

            const xmlText = await response.text();
            processCounter(xmlText);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const processCounter = (xml: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");

        const extractedData: any[] = [];

        ["Monitor", "Television", "Projector"].forEach((productType) => {
            xmlDoc.querySelectorAll(productType).forEach((item) => {
                extractedData.push({
                    id: item.querySelector("id")?.textContent || "",
                    model: item.querySelector("model")?.textContent || "",
                    brand: item.querySelector("brand")?.textContent || "",
                    price: item.querySelector("price")?.textContent || "",
                    revenue: item.querySelector("revenue")?.textContent || "",
                    stockDate: item.querySelector("stockDate")?.textContent || "",
                    totalOnStock: item.querySelector("totalOnStock")?.textContent || "",
                    remaining: item.querySelector("remaining")?.textContent || "",
                    soldNum: item.querySelector("soldNum")?.textContent || "",
                    soldCount: item.querySelector("soldCount")?.textContent || "",
                    stockFromDate: item.querySelector("stockFromDate")?.textContent || "",
                    stockToDate: item.querySelector("stockToEndDate")?.textContent || "",
                    type: productType
                });
            });
        });

        setAllStockData(extractedData);
        setFilteredStockData(extractedData);

        const summary = xmlDoc.querySelector("Summary");
        if (summary) {
            setSummaryData({
                periodMonitorSum: summary.querySelector("PeriodMonitorSum")?.textContent || "0",
                periodTelevisionSum: summary.querySelector("PeriodTelevisionSum")?.textContent || "0",
                periodProjectorSum: summary.querySelector("PeriodProjectorSum")?.textContent || "0",
                totalPeriodSum: summary.querySelector("TotalPeriodSum")?.textContent || "0",
                initialMonitorStock: summary.querySelector("InitialMonitorStock")?.textContent || "0",
                initialTelevisionStock: summary.querySelector("InitialTelevisionStock")?.textContent || "0",
                initialProjectorStock: summary.querySelector("InitialProjectorStock")?.textContent || "0",
                totalInitialStock: summary.querySelector("TotalInitialStock")?.textContent || "0",
                currentMonitorStock: summary.querySelector("CurrentMonitorStock")?.textContent || "0",
                currentTelevisionStock: summary.querySelector("CurrentTelevisionStock")?.textContent || "0",
                currentProjectorStock: summary.querySelector("CurrentProjectorStock")?.textContent || "0",
                currentTotalStock: summary.querySelector("CurrentTotalStock")?.textContent || "0",
                stockFromStartMonitor: summary.querySelector("StockFromStartMonitor")?.textContent || "0",
                stockFromStartTelevision: summary.querySelector("StockFromStartTelevision")?.textContent || "0",
                stockFromStartProjector: summary.querySelector("StockFromStartProjector")?.textContent || "0",
                stockToEndMonitor: summary.querySelector("StockToEndMonitor")?.textContent || "0",
                stockToEndTelevision: summary.querySelector("StockToEndTelevision")?.textContent || "0",
                stockToEndProjector: summary.querySelector("StockToEndProjector")?.textContent || "0",
                totalStockFromStart: summary.querySelector("TotalStockFromStart")?.textContent || "0",
                totalStockToEnd: summary.querySelector("TotalStockToEnd")?.textContent || "0",
            });
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetchCounter();
        }
    }, [startDate, endDate]);

    const formatDate = (date: string): string => {
        return new Date(date)
            .toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })
            .replace(/\//g, "-");
    };


    /*
    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
        if (!e.target.value) {
            setFilteredStockData(stockData);
            return;
        }
        setFilteredStockData(
            stockData.filter((product) =>
                product.id?.toLowerCase().includes(searchTerm) ||
                product.model?.toLowerCase().includes(searchTerm) ||
                product.productType?.toLowerCase().includes(searchTerm)
            )
        );
    };
    */

    /*
    const convertDateFormat = (date: string): string => {
        const [year, month, day] = date.split("-");
        return `${month}-${day}-${year}`; // ✅ Proper template literal syntax
    };

     */


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
                        <i className="bi bi-projector mr-4"></i> Sales Revenue & Sales Revenue by Dates
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
                                        Device .... not defined
                                    </th>
                                </tr>
                                </thead>

                                {/* Column Headers */}
                                <thead className="bg-gray-700 text-white font-semibold uppercase text-sm">
                                <tr>
                                    <th className="py-4 px-5 text-left w-1/2">Product Type</th>
                                    <th className="py-4 px-5 text-center w-1/2">Revenue</th>
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


                <div className="w-full px-1 mt-12">
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

                        {/* Warning & Date Summary Messages */}
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
                                            <h5 className="text-lg font-bold">{product.type}</h5>
                                            <p className="text-gray-700 text-sm"><strong>ID:</strong> {product.id}</p>

                                            {/* Detail Information */}
                                            <div className="bg-white mt-4 rounded-lg shadow-inner">
                                                <div className="bg-gray-700 text-white flex justify-between items-center p-2 rounded-t-lg">
                                                    <span className="text-sm">Detail Information</span>
                                                </div>
                                                <div className="p-4">
                                                    <p className="text-gray-700 text-sm"><strong>Brand:</strong> {product.brand}</p>
                                                    <p className="text-gray-700 text-sm"><strong>Model:</strong> {product.model}</p>
                                                    <p className="text-gray-700 text-sm"><strong>Price:</strong> ${product.price}</p>
                                                    <p className="text-gray-700 text-sm"><strong>Stock Date:</strong>{" "}{product.stockDate}</p>
                                                </div>

                                                {/* Additional details (only visible when showAll is true) */}
                                                {showAll && (
                                                    <div className="bg-white mt-4 rounded-lg shadow-inner">
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
                <div className="w-full flex flex-col items-center lg:items-start justify-center px-4">
                    {summaryData && (
                        <div className="w-full bg-white shadow-xl rounded-lg px-8 py-6 mt-6">
                            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-blue-100 text-blue-700 font-semibold uppercase text-sm">
                                <tr>
                                    <th className="py-3 px-5 text-left" colSpan={6}>
                                        SUMMARY
                                    </th>
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
                                <tr className="hover:bg-blue-50 even:bg-gray-50">
                                    <td className="py-3 px-5 text-gray-800 border-b">Monitor</td>
                                    <td className="py-3 px-5 text-center border-b">{summaryData.initialMonitorStock}</td>
                                    <td className="py-3 px-5 text-center border-b">{summaryData.currentMonitorStock}</td>
                                    <td className="py-3 px-5 text-center border-b">{summaryData.periodMonitorSum}</td>
                                    <td className="py-3 px-5 text-center border-b">{summaryData.stockFromStartMonitor}</td>
                                    <td className="py-3 px-5 text-center border-b">{summaryData.stockToEndMonitor}</td>
                                </tr>

                                <tr className="hover:bg-blue-50 even:bg-gray-50">
                                    <td className="py-3 px-5 text-gray-800 border-b">Television</td>
                                    <td className="py-3 px-5 text-center border-b">{summaryData.initialTelevisionStock}</td>
                                    <td className="py-3 px-5 text-center border-b">{summaryData.currentTelevisionStock}</td>
                                    <td className="py-3 px-5 text-center border-b">{summaryData.periodTelevisionSum}</td>
                                    <td className="py-3 px-5 text-center border-b">{summaryData.stockFromStartTelevision}</td>
                                    <td className="py-3 px-5 text-center border-b">{summaryData.stockToEndTelevision}</td>
                                </tr>

                                <tr className="hover:bg-blue-50 even:bg-gray-50">
                                    <td className="py-3 px-5 text-gray-800 border-b">Projector</td>
                                    <td className="py-3 px-5 text-center border-b">{summaryData.initialProjectorStock}</td>
                                    <td className="py-3 px-5 text-center border-b">{summaryData.currentProjectorStock}</td>
                                    <td className="py-3 px-5 text-center border-b">{summaryData.periodProjectorSum}</td>
                                    <td className="py-3 px-5 text-center border-b">{summaryData.stockFromStartProjector}</td>
                                    <td className="py-3 px-5 text-center border-b">{summaryData.stockToEndProjector}</td>
                                </tr>

                                {/* Total Summary */}
                                <tr className="bg-blue-100 font-bold text-blue-700">
                                    <td className="py-3 px-5 border-t">TOTAL</td>
                                    <td className="py-3 px-5 text-center border-t">{summaryData.totalInitialStock}</td>
                                    <td className="py-3 px-5 text-center border-t">{summaryData.currentTotalStock}</td>
                                    <td className="py-3 px-5 text-center border-t">{summaryData.totalPeriodSum}</td>
                                    <td className="py-3 px-5 text-center border-t">{summaryData.totalStockFromStart}</td>
                                    <td className="py-3 px-5 text-center border-t">{summaryData.totalStockToEnd}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NumberOfDevices;