import React, { useState } from "react";
import API_BASE_URL from "../../configuration/Config.tsx";




const Register: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [, setMessage] = useState<string>("");
    const [userCreatedSuccess, setUserCreatedSuccess] = useState<boolean | null>(null);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form reload

        try {
            const response = await fetch(`${API_BASE_URL}/CreateUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log("Create User Response:", data);

            // Extract API response and check success
            if (data?.d === true || data?.d === "true") {
                setUserCreatedSuccess(true);
                setMessage("User Created Successfully!");
                setUsername("");
                setPassword("");
            } else {
                setUserCreatedSuccess(false);
                setMessage("User Creation Failed.");
            }
        } catch (error) {
            console.error("Create User Error:", error);
            setUserCreatedSuccess(false);
            setMessage("Error while creating user. Please try again later.");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center mt-2">Create New User</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-5"
                    >
                        Create New User
                    </button>
                </form>

                {/* Display success or error message */}
                {userCreatedSuccess !== null && (
                    <div className="mt-6 text-center">
                        {userCreatedSuccess ? (
                            <div className="w-full mt-4 p-4 bg-green-100 border border-green-500 text-green-700 rounded-md">
                                <p className="text-center">User has been created!</p>
                            </div>
                        ) : (
                            <div className="w-full mt-4 p-4 bg-red-100 border border-red-500 text-red-700 rounded-md">
                                <p className="text-center">Registration Failed!</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="text-center mt-5">
                    <a href="/home-page" className="text-sm text-blue-500 hover:text-blue-700">
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Register;
