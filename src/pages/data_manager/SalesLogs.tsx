import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../configuration/Config.tsx";


interface SalesLog {
    id: string;
    price: number;
    soldNum: number;
    revenue: number;
    sellDates: string[];
    deviceType: string;
}

const SALES_REVENUE_URL = `${API_BASE_URL}/DisplaySalesLogs`;

const SalesLogs: React.FC = () => {
    const [salesLogs, setSalesLogs] = useState<SalesLog[]>([]);

    useEffect(() => {
        fetchSalesLogs();
    }, []);


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

    const fetchSalesLogs = async () => {
        try {
            const response = await axios.post(SALES_REVENUE_URL, null, {
                responseType: "document", // Ensure XML response
            });

            console.log("Raw XML Response:", response.data);

            const xmlData = response.data;
            const logs: SalesLog[] = [];

            // Extract data for Monitors, Televisions, and Projectors
            const deviceTypes = ["Monitor", "Television", "Projector"];

            deviceTypes.forEach((type) => {
                const devices = xmlData.getElementsByTagName(type);

                for (let i = 0; i < devices.length; i++) {
                    const device = devices[i];

                    const id = device.getElementsByTagName("id")[0]?.textContent || "";
                    const price = parseFloat(device.getElementsByTagName("price")[0]?.textContent?.replace(",", ".") || "0");
                    const soldNum = parseInt(device.getElementsByTagName("soldNum")[0]?.textContent || "0", 10);
                    const revenue = parseFloat(device.getElementsByTagName("revenue")[0]?.textContent?.replace(",", ".") || "0");

                    // Extract sell dates dynamically
                    const sellDates: string[] = [];
                    for (let j = 1; j <= 4; j++) {
                        const sellDate = device.getElementsByTagName(`sellDate${j}`)[0]?.textContent;
                        if (sellDate) sellDates.push(sellDate);
                    }

                    logs.push({ id, price, soldNum, revenue, sellDates, deviceType: type });
                }
            });

            console.log("Parsed Logs:", logs);

            setSalesLogs(logs);
        } catch (error) {
            console.error("Error fetching sales logs:", error);
        }
    };

    const getFilteredLogs = (type: string) => {
        return salesLogs
            .filter((log) => log.deviceType === type) // Ensure correct device type
            .filter((log) =>
                log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.sellDates.some(date => date.includes(searchTerm)) // Search in sell dates
            );
    };


    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };


    return (
        <div className="flex">
            <div className={`transition-all duration-300 ${ collapsed ? "ml-20" : "ml-64" } w-full`}>
                <div className="bg-gray-900 w-full h-20 fixed top-0 flex items-center shadow-md pl-8 z-10">
                    <h1 className="text-2xl font-bold text-white flex items-center"><i className="bi bi-journal-code mr-4"></i> Sales Logs (Sales Informations)</h1>

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search by Brand, ID..."
                        className="ml-10 p-2 rounded-lg bg-gray-600 text-white border px-3 py-2 border-gray-600 focus:outline-none focus:ring focus:ring-blue-500 w-32 sm:w-60"
                    />
                </div>


                {/* ✅ Sales Logs Display */}
                {/* Monitor Table */}
                <div className="w-full bg-white shadow-xl rounded-lg px-8 py-6 mt-24">
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-blue-100 text-blue-700 font-semibold uppercase text-sm">
                        <tr>
                            <th className="py-3 px-5 text-left" colSpan={5}>Monitors</th>
                        </tr>
                        </thead>
                        <thead className="bg-gray-700 text-white font-semibold uppercase text-sm">
                        <tr>
                            <th className="py-3 px-3 text-left">ID</th>
                            <th className="py-3 px-3 text-center">Price</th>
                            <th className="py-3 px-3 text-center">Sold</th>
                            <th className="py-3 px-3 text-center">Revenue</th>
                            <th className="py-3 px-3 text-center">Sell Dates</th>
                        </tr>
                        </thead>
                        <tbody>
                        {getFilteredLogs("Monitor").map((log) => (
                            <tr key={log.id} className="hover:bg-blue-50 even:bg-gray-50">
                                <td className="py-3 px-5 text-gray-800 border-b border-gray-200">{log.id}</td>
                                <td className="py-3 px-5 text-gray-800 border-b border-gray-200 text-center">$ {log.price.toFixed(2)}</td>
                                <td className="py-3 px-5 text-gray-800 border-b border-gray-200 text-center">{log.soldNum}</td>
                                <td className="py-3 px-5 text-gray-900 border-b border-gray-200 text-center">$ {log.revenue.toFixed(2)}</td>
                                <td className="py-3 px-5 text-gray-800 border-b border-gray-200 text-center">
                                    <ul>
                                        {log.sellDates.length > 0 ? (
                                            log.sellDates.map((date, index) => <li key={index}>{date}</li>)
                                        ) : (
                                            <span>—</span>
                                        )}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Television Table */}
                <div className="w-full bg-white shadow-xl rounded-lg px-8 py-6 mt-12">
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-blue-100 text-blue-700 font-semibold uppercase text-sm">
                        <tr>
                            <th className="py-3 px-5 text-left" colSpan={5}>Televisions</th>
                        </tr>
                        </thead>
                        <thead className="bg-gray-700 text-white font-semibold uppercase text-sm">
                        <tr>
                            <th className="py-3 px-3 text-left">ID</th>
                            <th className="py-3 px-3 text-center">Price</th>
                            <th className="py-3 px-3 text-center">Sold</th>
                            <th className="py-3 px-3 text-center">Revenue</th>
                            <th className="py-3 px-3 text-center">Sell Dates</th>
                        </tr>
                        </thead>
                        <tbody>
                        {getFilteredLogs("Television").map((log) => (
                            <tr key={log.id} className="hover:bg-blue-50 even:bg-gray-50">
                                <td className="py-3 px-5 text-gray-800 border-b border-gray-200">{log.id}</td>
                                <td className="py-3 px-5 text-gray-800 border-b border-gray-200 text-center">$ {log.price.toFixed(2)}</td>
                                <td className="py-3 px-5 text-gray-800 border-b border-gray-200 text-center">{log.soldNum}</td>
                                <td className="py-3 px-5 text-gray-900 border-b border-gray-200 text-center">$ {log.revenue.toFixed(2)}</td>
                                <td className="py-3 px-5 text-gray-800 border-b border-gray-200 text-center">
                                    <ul>
                                        {log.sellDates.length > 0 ? (
                                            log.sellDates.map((date, index) => <li key={index}>{date}</li>)
                                        ) : (
                                            <span>—</span>
                                        )}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Projector Table */}
                <div className="w-full bg-white shadow-xl rounded-lg px-8 py-6 mt-12">
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-blue-100 text-blue-700 font-semibold uppercase text-sm">
                        <tr>
                            <th className="py-3 px-5 text-left" colSpan={5}>Projectors</th>
                        </tr>
                        </thead>
                        <thead className="bg-gray-700 text-white font-semibold uppercase text-sm">
                        <tr>
                            <th className="py-3 px-3 text-left">ID</th>
                            <th className="py-3 px-3 text-center">Price</th>
                            <th className="py-3 px-3 text-center">Sold</th>
                            <th className="py-3 px-3 text-center">Revenue</th>
                            <th className="py-3 px-3 text-center">Sell Dates</th>
                        </tr>
                        </thead>
                        <tbody>
                        {getFilteredLogs("Projector").map((log) => (
                            <tr key={log.id} className="hover:bg-blue-50 even:bg-gray-50">
                                <td className="py-3 px-5 text-gray-800 border-b border-gray-200">{log.id}</td>
                                <td className="py-3 px-5 text-gray-800 border-b border-gray-200 text-center">$ {log.price.toFixed(2)}</td>
                                <td className="py-3 px-5 text-gray-800 border-b border-gray-200 text-center">{log.soldNum}</td>
                                <td className="py-3 px-5 text-gray-900 border-b border-gray-200 text-center">$ {log.revenue.toFixed(2)}</td>
                                <td className="py-3 px-5 text-gray-800 border-b border-gray-200 text-center">
                                    <ul>
                                        {log.sellDates.length > 0 ? (
                                            log.sellDates.map((date, index) => <li key={index}>{date}</li>)
                                        ) : (
                                            <span>—</span>
                                        )}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default SalesLogs;
