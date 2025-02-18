import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


const HomePage = () => {
    const navigate = useNavigate();

    // State for sidebar collapsed
    const [collapsed, setCollapsed] = useState(
        localStorage.getItem("sidebarCollapsed") === "true"
    );

    // Sync sidebar state with localStorage
    useEffect(() => {
        const handleSidebarState = () => {
            setCollapsed(localStorage.getItem("sidebarCollapsed") === "true");
        };

        // Listen for localStorage changes (useful for multi-tab scenarios)
        window.addEventListener("storage", handleSidebarState);

        return () => {
            // Cleanup the event listener when the component unmounts
            window.removeEventListener("storage", handleSidebarState);
        };
    }, []);


    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.removeItem("isLoggedIn"); // Remove authentication flag
        window.location.href = "/react-dp-prod/login"; // Force redirect to login
    };

    const handleCreateUser = () => {
        navigate("/register");
    };

    return (
        <div className="flex">
            {/* Main Content Wrapper */}
            <div
                className={`transition-all duration-300 ${
                    collapsed ? "ml-20" : "ml-64"
                } w-full`}
            >
                {/* Top Header */}
                <div
                    className="bg-gray-900 w-full h-20 fixed top-0 flex items-center shadow-md pl-8 pr-8 justify-between transition-all duration-300">
                    <h1 className="text-2xl font-bold text-white flex items-center">
                        <i className="bi bi-sun mr-4"></i> Home Page
                    </h1>

                    {/* Buttons */}
                    <div className="fixed top-5.5 right-5 sm:right-25 md:right-20 lg:right-12.5 flex gap-4">
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 w-27 sm:w-48 md:w-64 lg:w-70 hover:bg-red-700 transition-all"
                        >
                            Logout
                        </button>

                        {/* Create User Button */}
                        <button
                            onClick={handleCreateUser}
                            className="bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-200 w-27 sm:w-48 md:w-64 lg:w-70 hover:bg-green-700 transition-all"
                        >
                            Create User
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center lg:items-start lg:justify-center px-4 mt-20 w-full">
                    <div className="w-full h-full lg:10">
                        <div className="bg-white shadow-xl rounded-lg px-5 py-7">
                            <main className="flex-grow container mx-auto px-4 py-30 ">
                                <div id="welcome" className="flex flex-col md:flex-row md:space-y-0 space-y-6">
                                    <div className="md:w-1/2 md:pr-4 md:border-r border-gray-300">
                                        <h2 className="text-4xl font-bold mb-4">Welcome to the Display Devices Info
                                            Service</h2>
                                        <p className="text-lg mb-6">
                                            Our ASP.NET XML web service provides sorted information about display
                                            devices from our electronic store.
                                        </p>
                                    </div>
                                    <div className="md:w-1/2 md:pl-4">
                                        <h2 className="text-4xl font-bold mb-4">Vitajte v službe Display Devices Info
                                            Service</h2>
                                        <p className="text-lg mb-6">
                                            Naša webová služba ASP.NET XML poskytuje zoradené informácie o zobrazovacích
                                            zariadeniach z nášho elektronického obchodu.
                                        </p>
                                    </div>
                                </div>

                                <div id="about" className="mt-12 flex flex-col md:flex-row md:space-y-0 space-y-6">
                                    <div className="md:w-1/2 md:pr-4 md:border-r border-gray-300">
                                        <h3 className="text-2xl font-bold mb-4">About the Project</h3>
                                        <p className="text-lg">
                                            This web service is designed to deliver accurate and sorted data about
                                            display devices available in our electronic store. By leveraging ASP.NET and
                                            XML, the service ensures efficient data handling and seamless integration
                                            with client applications.
                                        </p>
                                    </div>
                                    <div className="md:w-1/2 md:pl-4">
                                        <h3 className="text-2xl font-bold mb-4">O projekte</h3>
                                        <p className="text-lg">
                                            Táto webová služba je navrhnutá na poskytovanie presných a zoradených údajov
                                            o zobrazovacích zariadeniach dostupných v našom elektronickom obchode.
                                            Využitím ASP.NET a XML služba zabezpečuje efektívnu správu údajov a
                                            bezproblémovú integráciu s klientskými aplikáciami.
                                        </p>
                                    </div>
                                </div>

                                <div id="features" className="mt-12 flex flex-col md:flex-row md:space-y-0 space-y-6">
                                    <div className="md:w-1/2 md:pr-4 md:border-r border-gray-300">
                                        <h3 className="text-2xl font-bold mb-4">Key Features</h3>
                                        <ul className="list-disc list-inside text-lg">
                                            <li>Analysis of XML web services for monitoring display device parameters
                                                (TVs, monitors, projectors) in an e-commerce system.
                                            </li>
                                            <li>Comparison with other tracking methods for display device parameters.
                                            </li>
                                            <li>Development of an ASP .NET XML web service to provide organized data
                                                based on selected criteria.
                                            </li>
                                            <li>Total counts of different display device types (TVs, monitors,
                                                projectors) at the start and end of the monitored period.
                                            </li>
                                            <li>Lists and basic details of display devices by manufacturer, brand, and
                                                category.
                                            </li>
                                            <li>Other relevant parameters for the monitored display devices.</li>
                                        </ul>
                                    </div>
                                    <div className="md:w-1/2 md:pl-4">
                                        <h3 className="text-2xl font-bold mb-4">Kľúčové vlastnosti</h3>
                                        <ul className="list-disc list-inside text-lg">
                                            <li>Analýza XML webových služieb na sledovanie parametrov zobrazovacích
                                                zariadení (televízory, monitory, projektory) v informačnom systéme
                                                elektronického obchodu.
                                            </li>
                                            <li>Porovnanie s inými metódami sledovania parametrov zobrazovacích
                                                zariadení.
                                            </li>
                                            <li>Vývoj ASP .NET XML webovej služby, ktorá poskytuje usporiadané údaje na
                                                základe vybraných kritérií.
                                            </li>
                                            <li>Celkový počet rôznych typov zobrazovacích zariadení (televízory,
                                                monitory, projektory) na začiatku a konci sledovaného obdobia.
                                            </li>
                                            <li>Zoznamy a základné údaje o zobrazovacích zariadeniach podľa výrobcu,
                                                značky a kategórie.
                                            </li>
                                            <li>Iné relevantné parametre pre sledované zobrazovacie zariadenia.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div id="contact" className="mt-12 flex flex-col md:flex-row md:space-y-0 space-y-6">
                                    <div className="md:w-1/2 md:pr-4 md:border-r border-gray-300">
                                        <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
                                        <p className="text-lg">
                                            Have any questions ? Text me using <a href="mailto:dujhelyi1@student.euba.sk"
                                                                               className="text-blue-600 hover:underline">email</a>.
                                        </p>
                                    </div>
                                    <div className="md:w-1/2 md:pl-4">
                                        <h3 className="text-2xl font-bold mb-4">Kontakt</h3>
                                        <p className="text-lg">
                                            Máte otázky ? Kontaktujte ma <a href="mailto:dujhelyi1@student.euba.sk"
                                                                               className="text-blue-600 hover:underline">emailom</a>.
                                        </p>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
                {/* Footer */}
                <footer className="bg-gray-800 text-white text-center py-4 w-full mt-40 shadow-md flex items-center justify-center gap-5">
                    <p>&copy; {new Date().getFullYear()} Display Devices Info Service. All rights reserved.</p>
                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-white text-1xl hover:text-gray-400 transition">
                        <i className="bi bi-github"></i>
                    </a>
                </footer>
            </div>
        </div>

    );

};

export default HomePage;
