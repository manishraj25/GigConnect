import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext, useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js"
import Avtar from "../assets/profile.png";

const freelancerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [search, setSearch] = useState("");
    const { logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const [selectCategories, setSelectCategories] = useState("");
    const [suggestions, setSuggestions] = useState([]);


    const menuRef = useRef(null);
    const navigate = useNavigate();


    const categories = [
        "Web Developer",
        "UI/UX Designer",
        "Logo Designer",
        "Mobile Developer",
        "Video Editor",
        "Full Stack Developer",
        "Backend Developer",
    ];

    //Fetch all gigs
    useEffect(() => {

        if (activeTab === "dashboard");
    }, [activeTab]);

    //Handle category change
    const handleCategories = (event) => {
        setSelectCategories(event.target.value);
    };


    // Close profile menu when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);




    //Suggestions while typing
    const handleTyping = (e) => {
        const text = e.target.value;
        setSearch(text);

        if (!text) return setSuggestions([]);

        const filtered = categories.filter((c) =>
            c.toLowerCase().includes(text.toLowerCase())
        );
        setSuggestions(filtered);
    };

    //Click suggestion
    const applySuggestion = (value) => {
        setSearch(value);
        setSuggestions([]);
    };




    return (
        <div className="min-h-screen bg-gray-100">
            {/* ------------------ NAVBAR ------------------ */}
            <nav>
                <div className="flex px-4 sm:px-8 justify-between bg-gray-100 items-center py-3 sm:py-4 w-full sticky top-0 text-black border-b border-gray-200">
                    <h1 className="text-lg sm:text-xl font-bold">
                        Gig<span className="text-green-600">Connect</span>
                    </h1>

                    {/* SEARCH BAR */}
                    <div className="relative border rounded w-[68vw] flex items-center justify-between h-11">
                        <input
                            type="text"
                            placeholder="Search freelancers..."
                            className="px-4 outline-none w-full py-2 rounded-l"
                            value={search}
                            onChange={handleTyping}
                        />

                        <button
                            className="px-3 bg-black rounded-r hover:bg-gray-800 h-full cursor-pointer flex items-center"
                        >
                            <lord-icon src="https://cdn.lordicon.com/xaekjsls.json"
                                trigger="hover"
                                colors="primary:#ffffff"
                                className="w-7 h-6">
                            </lord-icon>
                        </button>

                        {/* ✅ Auto suggestions dropdown */}
                        {suggestions.length > 0 && (
                            <div className="absolute top-10 bg-white w-full shadow-lg rounded z-50">
                                {suggestions.map((s, idx) => (
                                    <p
                                        key={idx}
                                        className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => applySuggestion(s)}
                                    >
                                        {s}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* NAV BUTTONS */}
                    <div className="flex gap-6">
                        <button onClick={() => setActiveTab("notification")} className="cursor-pointer w-5 h-5">
                            <lord-icon
                                src="https://cdn.lordicon.com/ahxaipjb.json"
                                colors="primary:#000000">
                            </lord-icon>
                        </button>
                        <button onClick={() => setActiveTab("messages")} className="cursor-pointer w-5 h-5">
                            <lord-icon
                                src="https://cdn.lordicon.com/bpptgtfr.json"
                                colors="primary:#000000">
                            </lord-icon>
                        </button>
                        <button onClick={() => setActiveTab("savelist")} className="cursor-pointer w-5 h-5">
                            <lord-icon
                                src="https://cdn.lordicon.com/hsabxdnr.json"
                                colors="primary:#000000">
                            </lord-icon>
                        </button>
                        <button onClick={() => setActiveTab("orders")} className="hover:text-green-600 hover:underline cursor-pointer">Orders</button>

                        {/* ✅ Avatar dropdown */}
                        <div className="relative" ref={menuRef}>
                            <img
                                src={user?.profilePic || Avtar}
                                className="w-8 h-8 rounded-full cursor-pointer"
                                onClick={() => setMenuOpen(!menuOpen)}
                            />

                            {menuOpen && (
                                <div className="absolute right-1 mt-4 w-52 bg-white shadow rounded border z-50">
                                    <button
                                        className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                                        onClick={() => {
                                            setActiveTab("profile");
                                            setMenuOpen(false);
                                        }}
                                    >
                                        Your Profile
                                    </button>

                                    <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">Post Project Brief</button>

                                    <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">Your Project Briefs</button>

                                    <button
                                        className="block px-4 py-2 w-full text-left text-red-500 hover:bg-gray-100"
                                        onClick={logout}
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* ------------------ BODY ------------------ */}
            <div className="">

                {/* DASHBOARD */}
                {activeTab === "dashboard" && (
                    <>
                        <div className="p-6 bg-linear-to-b from-green-100 to-transparent">
                            <h1 className="font-bold text-3xl mb-4 ">
                                Welcome to Gig<span className="text-green-600">Connect</span>, {user?.name}
                            </h1>
                            <div className="flex gap-5 mb-6 ml-5 ">
                                <div className="py-2.5 px-5 rounded-2xl min-w-1/4 bg-white shadow hover:shadow-lg transition cursor-pointer">
                                    <h1 className="text-sm font-sans font-semibold text-gray-500">RECOMMENDED FOR YOU</h1>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-gray-200 rounded-full p-2 flex items-center"><lord-icon
                                            src="https://cdn.lordicon.com/mubdgyyw.json"
                                            colors="primary:#000000"
                                            className="w-6 h-6">
                                        </lord-icon></div>
                                        <div>
                                            <div className="font-semibold">Post a project brief</div>
                                            <div className="text-gray-500">Get offers for your needs</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="py-2.5 px-5 rounded-2xl min-w-1/4 bg-white shadow hover:shadow-lg transition cursor-pointer">
                                    <h1 className="text-sm font-sans font-semibold text-gray-500">PROFILE PROGRESS</h1>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-gray-200 rounded-full p-2 flex items-center"><lord-icon
                                            src="https://cdn.lordicon.com/qlpudrww.json"
                                            colors="primary:#000000"
                                            className="w-6 h-6">
                                        </lord-icon></div>
                                        <div>
                                            <div className="font-semibold">Your profile is not completed</div>
                                            <div className="text-gray-500">Complete it to get tailored suggestion</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">

                        </div>
                    </>)}


                {/* SAVED LIST */}
                {activeTab === "savelist" && (
                    <>
                        <button
                            className="mb-4 px-4 py-2 bg-gray-300 rounded"
                            onClick={() => setActiveTab("dashboard")}
                        >
                            ← Back
                        </button>
                        <h1 className="text-2xl font-bold mb-4">Saved Freelancers ❤️</h1>
                    </>
                )}

                {/* MESSAGES */}
                {activeTab === "messages" && (
                    <>
                        <button
                            className="mb-4 px-4 py-2 bg-gray-300 rounded"
                            onClick={() => setActiveTab("dashboard")}
                        >
                            ← Back
                        </button>

                        <h2 className="text-xl font-bold mb-4">Messages</h2>

                    </>
                )}

                {/* PROFILE */}
                {activeTab === "profile" && (
                    <>
                        <button
                            className="mb-4 px-4 py-2 bg-gray-300 rounded"
                            onClick={() => setActiveTab("dashboard")}
                        >
                            ← Back
                        </button>

                        <h2 className="text-xl font-bold mb-4">Client Profile</h2>

                        <div className="bg-white p-6 rounded shadow">
                            <p><strong>Name:</strong> {user?.name}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>Role:</strong> {user?.role}</p>
                        </div>
                    </>
                )}

                {/* NOTIFICATIONS */}
                {activeTab === "notification" && (
                    <>
                        <button
                            className="mb-4 px-4 py-2 bg-gray-300 rounded"
                            onClick={() => setActiveTab("dashboard")}
                        >
                            ← Back
                        </button>

                        <h2 className="text-xl font-bold mb-4">Notifications</h2>
                    </>
                )}

                {/* ORDERS */}
                {activeTab === "orders" && (
                    <>
                        <button
                            className="mb-4 px-4 py-2 bg-gray-300 rounded"
                            onClick={() => setActiveTab("dashboard")}
                        >
                            ← Back
                        </button>

                        <h2 className="text-xl font-bold mb-4">Your orders</h2>
                    </>
                )}
            </div>
        </div>
    );
};
export default freelancerDashboard;
