import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const AuthNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(localStorage.getItem("role") || "");

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        if (storedRole) setSelectedRole(storedRole);
    }, []);

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        localStorage.setItem("role", role);


        navigate("/signup", { state: { role } });
    };

    if (location.pathname === "/roles" || location.pathname === "/login") {
        return (
            <nav className="sticky top-0 z-50 w-full">
                <div className="flex px-4 sm:px-8 justify-between  items-center py-3 sm:py-4 bg-gray-100 text-black stick top-0">
                    <Link to="/" className="text-lg sm:text-xl font-bold"><span>Gig</span><span className='text-green-600'>Connect</span></Link>
                </div>
            </nav>
        );
    }


    return (
        <nav className="sticky top-0 z-50 w-full">
            <div className="flex px-4 sm:px-8 justify-between  items-center py-3 sm:py-4 bg-gray-100 text-black stick top-0">
                <Link to="/" className="text-lg sm:text-xl font-bold"><span>Gig</span><span className='text-green-600'>Connect</span></Link>

                <div className="flex gap-3">
                    <button
                        onClick={() => handleRoleChange("client")}
                        disabled={selectedRole === "client"}
                        className={` ${selectedRole === "client"
                                ? " cursor-text"
                                : "text-green-600 cursor-pointer hover:underline"
                            }`}
                    >Join as Client
                    </button>
                    <button
                        onClick={() => handleRoleChange("freelancer")}
                        disabled={selectedRole === "freelancer"}
                        className={` ${selectedRole === "freelancer"
                                ? " cursor-text"
                                : "text-green-600 cursor-pointer hover:underline"
                            }`}
                    >
                    Join as Freelancer
                    </button>
                </div>
            </div>
        </nav>
    );
}
export default AuthNavbar;