import React, {useEffect, useState} from "react";
import axios from "axios";
import API_BASE_URL from "../../configuration/Config.tsx";

const SELL_DEVICE_URL = `${API_BASE_URL}/SellProducts`;
const DELETE_DEVICE_URL = `${API_BASE_URL}/DeleteProduct`


const DeviceManagement: React.FC = () => {
    const [productType, setProductType] = useState("");
    const [id, setId] = useState("");
    const [message, setMessage] = useState("");
    const [, setNoData] = useState(false);
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

    // Function to sell a device
    const sellDevice = async (productType: string, id: string) => {
        try {
            const formData = new URLSearchParams();
            formData.append("productType", productType);
            formData.append("id", id);

            const response = await axios.post(SELL_DEVICE_URL, formData.toString(), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            console.log("Device sold successfully:", response.data);
            setMessage("Device sold successfully!");
            setNoData(false);
        } catch (error) {
            console.error("Error selling device:", error);
            setMessage("Failed to sell device.");
        }
    };

    // Function to delete a device
    const deleteDevice = async (productType: string, id: string) => {
        try {
            const formData = new URLSearchParams();
            formData.append("productType", productType);
            formData.append("id", id);

            const response = await axios.post(DELETE_DEVICE_URL, formData.toString(), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            console.log("🗑️ Device deleted successfully:", response.data);
            setMessage("🗑️ Device deleted successfully!");
            setNoData(false);
        } catch (error) {
            console.error("Error deleting device:", error);
            setMessage("Failed to delete device.");
        }
    };

    // Handles form submission
    const handleSubmit = (action: "sell" | "delete", e: React.FormEvent) => {
        e.preventDefault();

        if (!productType || !id) {
            setMessage("⚠️ Please enter product type and device ID.");
            setNoData(true); // Show "No data found" message
            return;
        }

        action === "sell" ? sellDevice(productType, id) : deleteDevice(productType, id);
    };

    return (
        <div className="flex">
            {/* Sidebar aware layout */}
            <div className={`transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} w-full`}>
                {/* Header Section */}
                <div className="bg-gray-900 w-full h-20 fixed top-0 flex items-center shadow-md pl-8 z-10">
                    <h1 className="text-2xl font-bold text-white flex items-center">
                        <i className="bi bi-projector mr-4"></i> Selling or Deleting
                    </h1>
                </div>

                {/* Form Section - Placed at the top */}
                <div className="flex justify-center items-start pt-24 bg-gray-100 min-h-screen mt-20">
                    <form
                        onSubmit={(e) => handleSubmit("sell", e)}
                        className="flex flex-col w-full lg:w-2/3 bg-white shadow-xl rounded-lg px-8 py-6 space-y-4"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-left">Manage Device</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="productType" className="block text-sm font-medium text-gray-700">
                                    Product Type
                                </label>
                                <input
                                    type="text"
                                    id="productType"
                                    value={productType}
                                    onChange={(e) => setProductType(e.target.value)}
                                    required
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div>
                                <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                                    Product ID
                                </label>
                                <input
                                    type="text"
                                    id="id"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                    required
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                                />
                            </div>
                        </div>

                        {/* Buttons for Sell & Delete */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition duration-300"
                            >
                                Sell Device
                            </button>
                            <button
                                type="button"
                                onClick={(e) => handleSubmit("delete", e)}
                                className="w-full py-2 px-4 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition duration-300"
                            >
                                Delete Device
                            </button>
                        </div>

                        {/* Success/Error Message */}
                        {message && (
                            <div
                                className={`mt-4 p-3 text-center text-white font-semibold rounded-md ${
                                    message.includes("") || message.includes("🗑️") ? "bg-green-500" : "bg-red-500"
                                }`}
                            >
                                {message}
                            </div>
                        )}

                        {/* No Data Found Message */}
                        <div className="w-full mt-4 p-4 bg-red-100 border border-red-500 text-red-700 rounded-md">
                            <p className="text-center">
                                Be ceraful what you are doing, this operation cannot be roll back !
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeviceManagement;
