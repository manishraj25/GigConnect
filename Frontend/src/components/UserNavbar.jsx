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
                        <Link to="" className=" hover:font-bold mr-4">Profile</Link>
                        <button onClick={logout} className= " hover:font-bold bg-red-600 text-sm hover:bg-red-700 text-white px-3 py-2 rounded-xl font-bold text-center">Logout</button>
                    </div>
            </div>
        </nav>
    );
}
export default UserNavbar;