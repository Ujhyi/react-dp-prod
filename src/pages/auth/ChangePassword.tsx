import React, { useState } from "react";
import axios from "axios";

const CHANGE_PASSWORD_URL = "https://dp-asmx.com/MyASMXService/WebService.asmx/ChangePassword";

// Function to change user password
const changePassword = async (
    username: string,
    oldPassword: string,
    newPassword: string
): Promise<string> => {
    try {
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("oldPassword", oldPassword);
        formData.append("newPassword", newPassword);

        const response = await axios.post<string>(CHANGE_PASSWORD_URL, formData.toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            responseType: "text",
        });

        console.log("Raw XML Response:", response.data);

        // Parse XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");

        console.log("Parsed XML:", xmlDoc);

        // Check for XML parsing errors
        const errorNode = xmlDoc.querySelector("parsererror");
        if (errorNode) {
            console.error("Error parsing XML:", errorNode.textContent);
            return "Error parsing server response.";
        }

        // Extract the <boolean> element from XML (if it exists)
        const booleanElement = xmlDoc.getElementsByTagNameNS("http://tempuri.org/", "boolean")[0];
        const isSuccess = booleanElement ? booleanElement.textContent?.trim() === "true" : false;

        // Extract <Message> element if available
        const messageElement = xmlDoc.querySelector("Message");
        const message = messageElement ? messageElement.textContent?.trim() : null;

        if (isSuccess) {
            return message || "Password changed successfully!";
        } else {
            return message || "Password change failed.";
        }
    } catch (error) {
        console.error("Error changing password:", error);
        return "Error occurred while changing password.";
    }
};

// React Component for changing password
const ChangePassword: React.FC = () => {
    const [username, setUsername] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleChangePassword = async () => {
        const message = await changePassword(username, oldPassword, newPassword);
        setStatusMessage(message);
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 mt-10 text-center">Change Password</h2>
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
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <br />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <br />
                <button
                    onClick={handleChangePassword}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Change Password
                </button>
                {/* Forgot Password Link */}
                <div className="mt-4 text-center">
                    <a href="/react-dp-prod/#/login" className="text-sm text-blue-500 hover:text-blue-700">
                        Back to login
                    </a>
                </div>
                {statusMessage &&
                    <div className="w-full mt-4 p-4 bg-green-100 border border-green-500 text-green-700 rounded-md">
                        <p className="text-center">{statusMessage}</p>
                    </div>
                }
            </div>
        </div>
    );
};

export default ChangePassword;
