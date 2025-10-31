import React from "react";
import { Link } from "react-router-dom";

const HomeNavbar = () => {
  return (
        <nav className="sticky top-0 z-50 w-full">
            <div className="flex px-4 sm:px-8 justify-between  bg-gray-100 items-center py-3 sm:py-4 text-black">
                <h1 className="text-lg sm:text-xl font-bold"><span>Gig</span><span className='text-green-600'>Connect</span></h1>

                    <div>
                        <Link to="/login" className=" hover:font-bold mr-4">Log in</Link>
                        <Link to="/roles" className= " hover:font-bold bg-green-600 text-sm hover:bg-green-700 text-white px-3 py-2 rounded-xl font-bold text-center">Sign up</Link>
                    </div>
            </div>
        </nav>
    );
}
export default HomeNavbar;