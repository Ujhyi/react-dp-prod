import React, {useEffect, useState} from "react";
import axios from "axios";
import API_BASE_URL from "../../configuration/Config.tsx";

const ADD_NEW_DEVICE_URL = `${API_BASE_URL}/AddProduct`;


const AddNewDeviceComponent: React.FC = () => {
    const [formData, setFormData] = useState({
        productType: "",
        brand: "",
        model: "",
        displaySize: "",
        refreshRate: "",
        displayTech: "",
        maxResolutions: "",
        pixelResolutions: "",
        connections: "",
        output: "",
        speaker: "",
        smart: "",
        os: "",
        bluetooth: "",
        wirelessConnections: "",
        productionYear: "",
        vesa: "",
        color: "",
        price: "",
        stockDate: "",
        stock: "",
    });

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

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [message, setMessage] = useState("");

    const displayTechnologyOptions: { [key: string]: string[] } = {
        Monitor: ["LCD", "OLED"],
        Television: ["LCD", "OLED", "QLED", "NanoCell", "QNED"],
        Projector: ["DLP", "LCD", "LCoS"],
    };

    const displayResolutionsOptions: { [key: string]: string[] } = {
        Monitor: ["HD Ready", "Full HD", "Quad HD", "4K", "5K", "8K"],
        Television: ["HD Ready", "Full HD", "4K Ultra HD", "Ultra HD 8K"],
        Projector: ["SVGA", "XGA", "WXGA", "HD Ready", "Full HD", "4K Ultra HD"],
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const confirmAdd = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const addNewDevice = async () => {
        try {
            const body = new URLSearchParams();
            Object.entries(formData).forEach(([key, value]) => {
                body.set(key, value);
            });

            const response = await axios.post(ADD_NEW_DEVICE_URL, body.toString(), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            console.log("✅ Device added successfully:", response.data);
            setMessage("✅ Device added successfully!");
            setShowConfirmation(false);
            setFormData({
                productType: "",
                brand: "",
                model: "",
                displaySize: "",
                refreshRate: "",
                displayTech: "",
                maxResolutions: "",
                pixelResolutions: "",
                connections: "",
                output: "",
                speaker: "",
                smart: "",
                os: "",
                bluetooth: "",
                wirelessConnections: "",
                productionYear: "",
                vesa: "",
                color: "",
                price: "",
                stockDate: "",
                stock: "",
            });
        } catch (error) {
            console.error("❌ Error adding device:", error);
            setMessage("❌ Failed to add device.");
            setShowConfirmation(false);
        }
    };


    return (
        <div className="flex ">
            <div className={`transition-all duration-300 ${ collapsed ? "ml-0" : "ml-34" } w-full`}>

                {/* Sidebar Aware Layout */}
                <div className={`transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} w-full`}>
                    {/* Header Section */}
                    <header className="bg-gray-900 w-full h-20 fixed top-0 flex items-center shadow-lg px-8 z-10">
                        <h1 className="text-2xl font-bold text-white flex items-center"><i className="bi bi-projector mr-4"></i> Selling or Deleting</h1>
                    </header>

                    {/* Form Section */}
                    <main className="flex justify-center items-start pt-28 bg-gray-100 min-h-screen">
                        <div className="bg-white shadow-lg rounded-lg p-10 max-w-5xl w-full">
                            {/* Form */}
                            <form onSubmit={confirmAdd} className="space-y-6">
                                <h2 className="text-3xl font-bold text-gray-800 border-b pb-3">Add New Device</h2>
                                {/* Input Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {/* Product Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Product Type</label>
                                        <select name="productType" value={formData.productType} onChange={handleChange} required className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300">
                                            <option value="" disabled>Select</option>
                                            <option value="Monitor">Monitor</option>
                                            <option value="Television">Television</option>
                                            <option value="Projector">Projector</option>
                                        </select>
                                    </div>

                                    {/* Brand */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Brand</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        />
                                    </div>

                                    {/* Model */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Model</label>
                                        <input
                                            type="text"
                                            name="model"
                                            value={formData.model}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        />
                                    </div>

                                    {/* Display Size */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Display Size</label>
                                        <input
                                            type="text"
                                            name="displaySize"
                                            value={formData.displaySize}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        />
                                    </div>

                                    {/* Refresh Rate */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Refresh Rate</label>
                                        <input
                                            type="text"
                                            name="refreshRate"
                                            value={formData.refreshRate}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        />
                                    </div>

                                    {/* Pixel Resolutions */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Pixel Resolution (NxN)</label>
                                        <input
                                            type="text"
                                            name="pixelResolutions"
                                            value={formData.pixelResolutions}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        />
                                    </div>


                                    {/* Display Technology */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Display Technology</label>
                                        <select name="displayTech" value={formData.displayTech} onChange={handleChange} required className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300">
                                            <option value="" disabled>Select</option>
                                            {displayTechnologyOptions[formData.productType]?.map((res) => (
                                                <option key={res} value={res}>{res}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Max Resolution */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Max Resolutions</label>
                                        <select name="maxResolutions" value={formData.maxResolutions} onChange={handleChange} required className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300">
                                            <option value="" disabled>Select</option>
                                            {displayResolutionsOptions[formData.productType]?.map((res) => (
                                                <option key={res} value={res}>{res}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Connectivity */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Connectivity</label>
                                        <input
                                            type="text"
                                            name="connections"
                                            value={formData.connections}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        />
                                    </div>

                                    {/* OutPut */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Output</label>
                                        <input
                                            type="text"
                                            name="output"
                                            value={formData.output}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        />
                                    </div>

                                    {/* Speaker */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Speaker</label>
                                        <select
                                            name="speaker"
                                            value={formData.speaker}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        >
                                            <option value="" disabled>Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>

                                    {/* SMART */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">SMART</label>
                                        <select
                                            name="smart"
                                            value={formData.smart}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        >
                                            <option value="" disabled>Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>

                                    {/* Operating System */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Operating System</label>
                                        <input
                                            type="text"
                                            name="os"
                                            value={formData.os}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        />
                                    </div>

                                    {/* Bluetooth */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Bluetooth</label>
                                        <select
                                            name="bluetooth"
                                            value={formData.bluetooth}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        >
                                            <option value="" disabled>Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>

                                    {/* Wireless Connectivity */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Wireless Connectivity</label>
                                        <select
                                            name="wirelessConnections"
                                            value={formData.wirelessConnections}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        >
                                            <option value="" disabled>Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>

                                    {/* Production year */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Production Year</label>
                                        <input
                                            type="text"
                                            name="productionYear"
                                            value={formData.productionYear}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        />
                                    </div>

                                    {/* VESA */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">VESA</label>
                                        <select
                                            name="vesa"
                                            value={formData.vesa}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        >
                                            <option value="" disabled>Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>

                                    {/* COLOR */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Color</label>
                                        <input
                                            type="text"
                                            name="color"
                                            value={formData.color}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        />
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        />
                                    </div>

                                    {/* Stock Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Stock Date</label>
                                        <input
                                            type="date"
                                            name="stockDate"
                                            value={formData.stockDate}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        />
                                    </div>

                                    {/* Stock */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                                        />
                                    </div>

                                </div>

                                {/* Submit Button */}
                                <div className="text-center mt-6">
                                    <button
                                        type="submit"
                                        className="w-full py-3 px-6 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                                    >
                                        Add Device
                                    </button>
                                </div>
                            </form>
                        </div>
                    </main>

                    {/* Confirmation Modal */}
                    {showConfirmation && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                                <h2 className="text-lg font-semibold mb-4 text-gray-900">Are you sure you want to add this device?</h2>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                                        onClick={addNewDevice}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                                        onClick={() => setShowConfirmation(false)}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ✅ Success/Error Message */}
                    {message && (
                        <p className="mt-4 p-3 bg-gray-100 border rounded-md text-center text-gray-800 font-semibold">
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddNewDeviceComponent;
