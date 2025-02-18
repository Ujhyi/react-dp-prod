import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LOGIN_URL = "https://dp-asmx.com/MyASMXService/WebService.asmx/Login";

// Function to handle login and store authentication state
const login = async (username: string, password: string): Promise<boolean> => {
    try {
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        const response = await axios.post<string>(LOGIN_URL, formData.toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            responseType: "text",
        });

        console.log("Raw Response:", response.data);

        // Parse XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "application/xml");

        console.log("Parsed XML:", xmlDoc);

        // Extract boolean value from XML
        const booleanElement = xmlDoc.getElementsByTagNameNS("http://tempuri.org/", "boolean")[0];
        const isSuccess = booleanElement ? booleanElement.textContent?.trim() === "true" : false;

        console.log("Login Success:", isSuccess);

        // ✅ Store authentication state in localStorage only if login is successful
        if (isSuccess) {
            localStorage.setItem("isLoggedIn", "true");
        } else {
            localStorage.removeItem("isLoggedIn");
        }

        return isSuccess;
    } catch (error) {
        console.error("Login error:", error);
        localStorage.removeItem("isLoggedIn"); // Prevent unintended access if error occurs
        return false;
    }
};



// Login Component
const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState<string | null>(null);
    const navigate = useNavigate(); // React Router navigation

    const handleLogin = async () => {
        const isLoggedIn = await login(username, password);
        if (isLoggedIn) {
            navigate("/home-page"); // Redirect to home page if login is successful
        } else {
            setLoginStatus("Login failed.");
        }
    };


    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                <div className="w-full mt-4 p-4 bg-yellow-100 border border-yellow-500 text-yellow-700 rounded-md">
                    <p className="text-center">Warning!</p>
                    <p className="text-center">For Registration contact Administrator.</p>
                </div>
                <h2 className="text-2xl font-bold mb-6 mt-10 text-center">Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <br />
                <button
                    onClick={handleLogin}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Login
                </button>


                {/* Forgot Password Link */}
                <div className="mt-4 text-center">
                    <a href="/react-dp-prod/#/change-password" className="text-sm text-blue-500 hover:text-blue-700">
                        Change Password
                    </a>
                </div>
                {loginStatus && <p>{loginStatus}</p>}
            </div>
        </div>
    );
};

export default Login;
