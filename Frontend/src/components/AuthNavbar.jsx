import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleRoleChange = (role) => {
        // Update role without reloading
        localStorage.setItem("role", role);
        if (location.pathname === "/signup") {
            navigate("/signup", { state: { role } });
        } else {
            navigate("/signup", { state: { role } });
        }
    };

    if (location.pathname === "/roles" || location.pathname === "/login") {
        return (
            <nav >
                <div className="flex px-4 sm:px-8 justify-between  items-center py-3 sm:py-4 bg-gray-100 text-black stick top-0">
                    <h1 className="text-lg sm:text-xl font-bold"><span>Gig</span><span className='text-green-600'>Connect</span></h1>
                </div>
            </nav>
        );
    }


    return (
        <nav >
            <div className="flex px-4 sm:px-8 justify-between  items-center py-3 sm:py-4 bg-gray-100 text-black stick top-0">
                <h1 className="text-lg sm:text-xl font-bold"><span>Gig</span><span className='text-green-600'>Connect</span></h1>

                <div>
                    <button
                        onClick={() => handleRoleChange("client")}
                        className="hover:font-bold mr-4"
                    >
                        Client
                    </button>
                    <button
                        onClick={() => handleRoleChange("freelancer")}
                        className="hover:font-bold"
                    >
                        Freelancer
                    </button>
                </div>
            </div>
        </nav>
    );
}
export default AuthNavbar;