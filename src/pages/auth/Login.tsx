import React, { useState } from "react";
import API_BASE_URL from "../../configuration/Config.tsx";


const Login: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const login = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}/Login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log("🔍 Login Response:", data);

            // Backend response should be `{ d: true }` for success
            const isLoginSuccessful = data?.d === true;

            if (isLoginSuccessful) {
                console.log("Login Successful!");
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("isAuthenticatedFromServer", "true");

                // Force full page reload to ensure `PrivateRoute.tsx` picks up the new auth state
                window.location.href = "/home-page";
            } else {
                console.warn("Login Failed: Invalid credentials");
                setMessage("Login Failed: Invalid credentials");
            }
        } catch (error) {
            console.error("⚠Login Error:", error);
            setMessage("Error while logging in. Please check your credentials or try again later.");
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
                <form onSubmit={login}>
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
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Login
                    </button>
                </form>

                {/* Forgot Password Link */}
                <div className="mt-4 text-center">
                    <a href="/react-dp-prod/change-password" className="text-sm text-blue-500 hover:text-blue-700">
                        Change Password
                    </a>
                </div>

                <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
            </div>
        </div>
    );
};

export default Login;
