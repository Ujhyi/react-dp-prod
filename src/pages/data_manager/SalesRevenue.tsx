import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../configuration/Config.tsx";


interface ProductProfit {
    ProductType: string;
    Profit: string;
}

interface RevenueData {
    type: string;
    id: string;
    number: string;
    price: string;
    revenue: string;
}

const SalesRevenue: React.FC = () => {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [salesRevenue, setSalesRevenue] = useState<ProductProfit[]>([]);
    const [totalProfit, setTotalProfit] = useState<string>("");
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");



    const salesRevenueByDateUrl = `${API_BASE_URL}/CalculateRevenueByDate`;
    const salesRevenueUrl = `${API_BASE_URL}/SalesRevenue`;

    useEffect(() => {
        fetchTotalSalesRevenue();
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            fetchRevenueByDate();
        }
    }, [startDate, endDate]);

    const fetchTotalSalesRevenue = async () => {
        try {
            const response = await fetch(salesRevenueUrl, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            const textResponse = await response.text();
            processTotalRevenueData(textResponse);
        } catch (error) {
            console.error("Error fetching total sales revenue:", error);
            alert("An error occurred while fetching total sales revenue.");
        }
    };

    const fetchRevenueByDate = async () => {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        try {
            const response = await fetch(salesRevenueByDateUrl, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ startDate: formattedStartDate, endDate: formattedEndDate }),
            });

            const textResponse = await response.text();
            processRevenueData(textResponse);
        } catch (error) {
            console.error("Error fetching revenue data:", error);
            alert("An error occurred while fetching revenue data.");
        }
    };

    const formatDate = (date: string): string => {
        return new Date(date)
            .toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })
            .replace(/\//g, "-");
    };

    const processTotalRevenueData = (response: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, "text/xml");
        const products = xmlDoc.getElementsByTagName("ProductProfit");
        const summary: ProductProfit[] = [];

        for (let i = 0; i < products.length; i++) {
            summary.push({
                ProductType: products[i].getElementsByTagName("ProductType")[0]?.textContent || "",
                Profit: products[i].getElementsByTagName("Profit")[0]?.textContent || "",
            });
        }

        setSalesRevenue(summary);
        setTotalProfit(xmlDoc.getElementsByTagName("TotalProfit")[0]?.textContent || "");
    };

    const [, setNoRecordsMessage] = useState<string | null>(null);

    const processRevenueData = (response: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, "text/xml");

        // Check if there is a <Message> element
        const messageNode = xmlDoc.getElementsByTagName("Message")[0];

        if (messageNode) {
            setRevenueData([]); // Clear revenue data
            setNoRecordsMessage(messageNode.textContent || "No records found for the selected date range."); // Update warning message
            return;
        }

        // Process XML normally if no "Message" node exists
        setNoRecordsMessage(null); // Clear warning message when records exist

        const types = ["Monitor", "Television", "Projector"];
        const parsedData: RevenueData[] = [];

        types.forEach((type) => {
            const items = xmlDoc.getElementsByTagName(type);
            for (let i = 0; i < items.length; i++) {
                parsedData.push({
                    type,
                    id: items[i].getElementsByTagName("id")[0]?.textContent || "",
                    number: items[i].getElementsByTagName("count")[0]?.textContent || "",
                    price: items[i].getElementsByTagName("price")[0]?.textContent || "",
                    revenue: items[i].getElementsByTagName("revenue")[0]?.textContent || "",
                });
            }
        });

        setRevenueData(parsedData);
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
                    <h1 className="text-2xl font-bold text-white flex items-center"><i className="bi bi-bank mr-4"></i> Sales Revenue & Sales Revenue by Dates</h1>
                </div>

                <div className="flex flex-col items-center lg:items-start lg:justify-center px-4 mt-20 w-full">
                    {/* Sales Revenue Summary */}
                    {salesRevenue.length > 0 && (
                        <div className="w-full bg-white shadow-xl rounded-lg px-8 py-6">
                            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">

                                <thead className="bg-blue-100 text-blue-700 font-semibold uppercase text-sm">
                                <tr>
                                    <th className="py-3 px-5 text-left" colSpan={5}>Sales Revenue Summary (Since Shop Started)</th>
                                </tr>
                                </thead>


                                <thead className="bg-gray-700 text-white font-semibold uppercase text-sm">
                                <tr>
                                    <th className="py-4 px-5 text-left">Product Type</th>
                                    <th className="py-4 px-5 text-center">Revenue</th>
                                </tr>
                                </thead>
                                <tbody>
                                {salesRevenue.map((product, index) => (
                                    <tr key={index} className="hover:bg-blue-50 even:bg-gray-50">
                                        <td className="py-3 px-5">{product.ProductType}</td>
                                        <td className="py-3 px-5 text-center">$ {product.Profit}</td>
                                    </tr>
                                ))}
                                <tr className="bg-blue-100 font-bold text-blue-700">
                                    <td className="py-3 px-5">Total Profit</td>
                                    <td className="py-3 px-5 text-center">$ {totalProfit}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    )}


                    { /* Revenue by date */}
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
                                                placeholder="Search by ID..."
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

                                {/* Date Summary Message - Shows Either "No Records" or the Date Range */}
                                {startDate && endDate && (
                                    <div
                                        className={`py-6 px-4 border rounded-md text-center mt-2 ${ revenueData.length === 0
                                                ? "bg-red-100 border-red-500 text-red-700"
                                                : "bg-green-100 border-green-500 text-green-700"
                                        }`}
                                    >
                                        {revenueData.length === 0 ? (
                                            <strong>No recordings found between the selected dates!</strong>
                                        ) : (
                                            <>
                                                Records from <strong>{formatDate(startDate)}</strong> to <strong>{formatDate(endDate)}</strong>
                                            </>
                                        )}
                                    </div>
                                )}






                            </div>
                            {/* Table Header */}
                            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-700 text-white font-semibold uppercase text-sm mt-10">
                                <tr>
                                    <th className="py-3 px-6 text-left">Product Type</th>
                                    <th className="py-3 px-5 text-center">ID</th>
                                    <th className="py-3 px-5 text-center">Count</th>
                                    <th className="py-3 px-5 text-center">Price</th>
                                    <th className="py-3 px-5 text-center">Revenue</th>
                                </tr>
                                </thead>
                                <tbody>
                                {revenueData
                                    .filter((item) =>
                                        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        item.type.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map((item, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="py-3 px-5 text-gray-800 border-b border-gray-200">{item.type}</td>
                                            <td className="py-3 px-5 text-gray-800 border-b border-gray-200 text-center">{item.id}</td>
                                            <td className="py-3 px-5 text-gray-800 border-b border-gray-200 text-center">{item.number}</td>
                                            <td className="py-3 px-5 text-gray-800 border-b border-gray-200 text-center">$ {item.price}</td>
                                            <td className="py-3 px-5 text-gray-800 border-b border-gray-200 text-center">$ {item.revenue}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesRevenue;
