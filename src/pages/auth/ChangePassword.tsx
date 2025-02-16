import React, { useState } from "react";
import API_BASE_URL from "../../configuration/Config.tsx";


const ChangePassword: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<boolean | null>(null);
    const [, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form reload

        try {
            const response = await fetch(`${API_BASE_URL}/ChangePassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, oldPassword, newPassword }),
            });

            const data = await response.json();
            console.log("Change Password Response:", data);

            // ✅ Adjust based on API response
            if (data?.d === true || data?.d === "true") {
                setPasswordChangeSuccess(true);
                setErrorMessage(null);
                setUsername("");
                setOldPassword("");
                setNewPassword("");
            } else {
                setPasswordChangeSuccess(false);
                setErrorMessage("Password change failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Change Password Error:", error);
            setPasswordChangeSuccess(false);
            setErrorMessage("An error occurred while changing your password.");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <a href="/login" className="text-sm text-blue-500 hover:text-blue-700">
                        Back to Login
                    </a>
                </div>
                <h2 className="text-2xl font-bold mb-6 text-center mt-2">Change Password</h2>

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
                        <label htmlFor="old_password" className="block text-sm font-medium text-gray-700">
                            Old Password
                        </label>
                        <input
                            id="old_password"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            id="new_password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-5"
                    >
                        Change Password
                    </button>
                </form>

                {/* Display success or error message */}
                {passwordChangeSuccess !== null && (
                    <div className="mt-6 text-center">
                        {passwordChangeSuccess ? (
                            <div className="w-full mt-4 p-4 bg-green-100 border border-green-500 text-green-700 rounded-md">
                                <p className="text-center">Password changed successfully!</p>
                            </div>
                        ) : (
                            <div className="w-full mt-4 p-4 bg-red-100 border border-red-500 text-red-700 rounded-md">
                                <p className="text-center">Password changed un-successfull!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChangePassword;
