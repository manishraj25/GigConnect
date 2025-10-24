// ClientDashboard.jsx
import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext, useAuth } from "../context/AuthContext.jsx";
import API from "../api/api.js";
import Avtar from "../assets/profile.png";


const ClientDashboard = () => {
    const { user, setUser } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [freelancers, setFreelancers] = useState([]);
    const [filteredFreelancers, setFilteredFreelancers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const { logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const menuRef = useRef(null);

    // Close menu on outside click
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Fetch freelancers
    useEffect(() => {
        if (activeTab === "dashboard") {
            const fetchFreelancers = async () => {
                setLoading(true);
                try {
                    const res = await API.get("/api/freelancers");
                    setFreelancers(res.data);
                    setFilteredFreelancers(res.data); // initial filtered list
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchFreelancers();
        }
    }, [activeTab]);

    // Filter freelancers on search
    useEffect(() => {
        const filtered = freelancers.filter((f) =>
            f.name.toLowerCase().includes(search.toLowerCase()) ||
            f.skills?.some((skill) =>
                skill.toLowerCase().includes(search.toLowerCase())
            )
        );
        setFilteredFreelancers(filtered);
    }, [search, freelancers]);

    const handleSearch = () => {
        const filtered = freelancers.filter((f) =>
            f.name.toLowerCase().includes(search.toLowerCase()) ||
            f.skills?.some((skill) =>
                skill.toLowerCase().includes(search.toLowerCase())
            )
        );
        setFilteredFreelancers(filtered);
    };


    // Fetch messages
    useEffect(() => {
        if (activeTab === "messages") {
            const fetchMessages = async () => {
                setLoading(true);
                try {
                    const res = await API.get("/api/messages");
                    setMessages(res.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchMessages();
        }
    }, [activeTab]);


    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav >
                <div className="flex px-4 sm:px-8 justify-between  bg-gray-100 items-center py-3 sm:py-4 w-full sticky top-0  text-black border-b border-gray-200">
                    <h1 className="text-lg sm:text-xl font-bold"><span>Gig</span><span className='text-green-600'>Connect</span></h1>

                    <div className="border rounded w-[70vw] flex items-center justify-between">
                        <input
                            type="text"
                            placeholder="Search freelancers..."
                            className="px-4"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            onClick={handleSearch}
                            className="px-3 py-2 bg-black  rounded-r hover:bg-gray-800 flex items-center justify-center"
                        ><lord-icon
                            src="https://cdn.lordicon.com/xaekjsls.json"
                            trigger="hover"
                            colors="primary:#ffffff"
                            className="w-7 h-6">
                            </lord-icon></button>
                    </div>

                    <div className="flex items-center justify-center gap-5">
                        <button className="w-8 h-8 "><lord-icon
                            src="https://cdn.lordicon.com/ahxaipjb.json"
                            trigger="hover"
                        >
                        </lord-icon></button>

                        <button
                            className="w-8 h-8 "
                            onClick={() => setActiveTab("messages")}
                        >
                            <lord-icon
                                src="https://cdn.lordicon.com/bpptgtfr.json"
                                trigger="hover">
                            </lord-icon>
                        </button>

                        {/* ✅ Profile Avatar Button */}
                        <div className="relative" ref={menuRef}>
                            <img
                                src={user?.profilePic || Avtar}
                                className="w-8 h-8 rounded-full cursor-pointer "
                                onClick={() => setMenuOpen(!menuOpen)}
                            />

                            {/* ✅ Small Popup Menu */}
                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded border z-50">
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        onClick={() => {
                                            setActiveTab("profile");
                                            setMenuOpen(false);
                                        }}
                                    >
                                        Profile
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                                        onClick={logout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Dashboard Content */}
            <div className="p-6 ">
                {activeTab === "dashboard" && (
                    <>
                        {/* Top Actions */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="font-bold text-3xl">Welcome to Gig<span className='text-green-600'>Connect</span>, Manish</h1>
                        </div>
                    </>
                )}

                {activeTab === "messages" && (
                    <div>
                        <button
                            className="mb-4 px-4 py-2 bg-gray-300 rounded"
                            onClick={() => setActiveTab("dashboard")}
                        >
                            ← Back
                        </button>
                        <h2 className="text-xl font-bold mb-4">Messages</h2>
                        {loading ? (
                            <div>Loading messages...</div>
                        ) : messages.length === 0 ? (
                            <div>No messages</div>
                        ) : (
                            <ul>
                                {messages.map((m) => (
                                    <li
                                        key={m._id}
                                        className="bg-white p-3 mb-2 rounded shadow"
                                    >
                                        <strong>{m.fromName}:</strong> {m.text}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {activeTab === "profile" && (
                    <div>
                        <button
                            className="mb-4 px-4 py-2 bg-gray-300 rounded"
                            onClick={() => setActiveTab("dashboard")}
                        >
                            ← Back
                        </button>
                        <h2 className="text-xl font-bold mb-4">Client Profile</h2>
                        <div className="bg-white p-6 rounded shadow">
                            <p>
                                <strong>Name:</strong> {user?.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {user?.email}
                            </p>
                            <p>
                                <strong>Role:</strong> {user?.role}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;
