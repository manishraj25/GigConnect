import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const UserNavbar = () => {
    const { logout } = useAuth();

    return (
        <nav >
            <div className="flex px-4 sm:px-8 justify-between  bg-gray-100 items-center py-3 sm:py-4 sticky top-0 text-black">
                <h1 className="text-lg sm:text-xl font-bold"><span>Gig</span><span className='text-green-600'>Connect</span></h1>

                <div>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={() => setActiveTab("messages")}
                    >
                        Messages
                    </button>
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded"
                        onClick={() => setActiveTab("profile")}
                    >
                        Profile
                    </button>
                    <button onClick={logout} className=" hover:font-bold bg-red-600 text-sm hover:bg-red-700 text-white px-3 py-2 rounded-xl font-bold text-center">Logout</button>
                </div>
            </div>
        </nav>
    );
}
export default UserNavbar;