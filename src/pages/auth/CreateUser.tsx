import React, { useState } from "react";
import axios from "axios";

const CREATE_USER_URL = "https://dp-asmx.com/MyASMXService/WebService.asmx/CreateUser";

// Function to create a new user
const createUser = async (username: string, password: string): Promise<boolean> => {
    try {
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        const response = await axios.post<string>(CREATE_USER_URL, formData.toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            responseType: "text",
        });

        console.log("Raw XML Response:", response.data);

        // Parse XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "application/xml");

        console.log("Parsed XML:", xmlDoc);

        // Extract boolean value from XML
        const booleanElement = xmlDoc.getElementsByTagNameNS("http://tempuri.org/", "boolean")[0];
        const isSuccess = booleanElement ? booleanElement.textContent?.trim() === "true" : false;

        console.log("Create User Success:", isSuccess);
        return isSuccess;
    } catch (error) {
        console.error("Create User Error:", error);
        return false;
    }
};

// React Component for user registration
const Register: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [registerStatus, setRegisterStatus] = useState<string | null>(null);
    //const navigate = useNavigate(); // React Router navigation

    const handleRegister = async () => {
        const isCreated = await createUser(username, password);
        if (isCreated) {
            setRegisterStatus("User created successfully! Redirecting to login...");
        } else {
            setRegisterStatus("User creation failed.");
        }
    };

    return (

        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 mt-10 text-center">Create new User</h2>
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
                    onClick={handleRegister}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Register
                </button>
                {/* Forgot Password Link */}
                <div className="mt-4 text-center">
                    <a href="/react-dp-prod/home-page" className="text-sm text-blue-500 hover:text-blue-700">
                        Back to Home.
                    </a>
                </div>

                {registerStatus &&
                    <div className="w-full mt-4 p-4 bg-green-100 border border-green-500 text-green-700 rounded-md">
                        <p className="text-center">User has been successfully created.</p>
                    </div>
                }

            </div>
        </div>

    );
};

export default Register;
