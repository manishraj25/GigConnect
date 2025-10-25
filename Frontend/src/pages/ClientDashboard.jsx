// ClientDashboard.jsx
import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext, useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";
import Avtar from "../assets/profile.png";

const ClientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [freelancers, setFreelancers] = useState([]);
    const [filteredFreelancers, setFilteredFreelancers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const { logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    // NEW States 🌟
    const [suggestions, setSuggestions] = useState([]);
    const [saveList, setSaveList] = useState([]);
    const [page, setPage] = useState(1);

    const navigate = useNavigate();
    const menuRef = useRef(null);

    const categories = [
        "Web Developer", "UI/UX Designer", "Logo Designer",
        "Mobile Developer", "Video Editor", "Full Stack Developer",
        "Backend Developer"
    ];

    // ✅ Dummy explore freelancers
    const dummyFreelancers = [
        {
            _id: 1,
            name: "Rahul Sharma",
            skills: ["Web Dev", "React", "Node"],
            profilePic: null,
        },
        {
            _id: 2,
            name: "Priya Verma",
            skills: ["UI/UX", "Figma"],
            profilePic: null,
        },
        {
            _id: 3,
            name: "Aman Singh",
            skills: ["Backend", "Express"],
            profilePic: null,
        },
        {
            _id: 4,
            name: "Sara Khan",
            skills: ["Mobile Dev", "Flutter"],
            profilePic: null,
        },
    ];

    // ✅ Close profile menu when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ✅ Fetch freelancers
    useEffect(() => {
        if (activeTab === "dashboard") {
            const fetchFreelancers = async () => {
                setLoading(true);
                try {
                    const res = await API.get(`/api/freelancers?page=${page}`);
                    if (page === 1) {
                        setFreelancers(res.data);
                        setFilteredFreelancers(res.data);
                    } else {
                        setFreelancers((p) => [...p, ...res.data]);
                        setFilteredFreelancers((p) => [...p, ...res.data]);
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchFreelancers();
        }
    }, [activeTab, page]);

    // ✅ Infinite scroll trigger
    useEffect(() => {
        const onScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 3) {
                setPage((prev) => prev + 1);
            }
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // ✅ Suggestions while typing
    const handleTyping = (e) => {
        const text = e.target.value;
        setSearch(text);

        if (!text) return setSuggestions([]);

        const filtered = categories.filter(c =>
            c.toLowerCase().includes(text.toLowerCase())
        );

        const names = freelancers
            .map(f => f.name)
            .filter(n => n.toLowerCase().includes(text.toLowerCase()));

        setSuggestions([...filtered, ...names]);
    };

    // ✅ Click suggestion
    const applySuggestion = (value) => {
        setSearch(value);
        setSuggestions([]);
    };

    // ✅ Go to search result page
    const goSearchResults = () => {
        if (!search.trim()) return;
        navigate(`/search?query=${search}`);
    };

    // ✅ Save/Unsave freelancers ❤️
    const toggleSave = (id) => {
        setSaveList((prev) =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    // ✅ Fetch messages
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
            {/* ------------------ NAVBAR ------------------ */}
            <nav>
                <div className="flex px-4 sm:px-8 justify-between bg-gray-100 items-center py-3 sm:py-4 w-full sticky top-0 text-black border-b border-gray-200">
                    <h1 className="text-lg sm:text-xl font-bold">
                        Gig<span className="text-green-600">Connect</span>
                    </h1>

                    {/* SEARCH BAR */}
                    <div className="relative border rounded w-[68vw] flex items-center justify-between">
                        <input
                            type="text"
                            placeholder="Search freelancers..."
                            className="px-4 outline-none w-full py-2 rounded-l"
                            value={search}
                            onChange={handleTyping}
                        />

                        <button
                            onClick={goSearchResults}
                            className="px-3 py-2 bg-black rounded-r hover:bg-gray-800"
                        >
                            <lord-icon src="https://cdn.lordicon.com/xaekjsls.json"
                                trigger="hover" colors="primary:#ffffff"
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
                    <div className="flex items-center justify-center gap-5">
                        <button onClick={() => setActiveTab("messages")}>Messages</button>
                        <button onClick={() => setActiveTab("savelist")}>SaveList</button>
                        <button>Orders</button>

                        {/* ✅ Avatar dropdown */}
                        <div className="relative" ref={menuRef}>
                            <img
                                src={user?.profilePic || Avtar}
                                className="w-8 h-8 rounded-full cursor-pointer"
                                onClick={() => setMenuOpen(!menuOpen)}
                            />

                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded border z-50">
                                    <button
                                        className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                                        onClick={() => {
                                            setActiveTab("profile");
                                            setMenuOpen(false);
                                        }}
                                    >
                                       View Profile
                                    </button>

                                    <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">Post Your Gig</button>

                                    <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">Your Gigs</button>

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
            <div className="p-6">

                {/* DASHBOARD */}
                {activeTab === "dashboard" && (
                    <>
                        <h1 className="font-bold text-3xl mb-6">
                            Welcome to Gig<span className="text-green-600">Connect</span>, {user?.name}
                        </h1>

                        <h2 className="text-2xl font-medium">
                            Explore freelancers
                        </h2>

                        {/* ✅ Dummy Explore Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                            {dummyFreelancers.map((freelancer) => (
                                <div key={freelancer._id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
                                    <img
                                        src={freelancer.profilePic || Avtar}
                                        className="w-16 h-16 rounded-full mb-4"
                                    />
                                    <h2 className="text-lg font-bold">{freelancer.name}</h2>
                                    <p className="text-sm text-gray-600 mb-2">{freelancer.skills.join(", ")}</p>
                                    <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                        View Profile
                                    </button>
                                </div>
                            ))}
                        </div>

                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                                {filteredFreelancers.map((freelancer) => (
                                    <div
                                        key={freelancer._id}
                                        className="bg-white p-4 rounded shadow hover:shadow-lg transition"
                                    >
                                        <div className="flex justify-between">
                                            <img
                                                src={freelancer.profilePic || Avtar}
                                                className="w-16 h-16 rounded-full mb-4"
                                            />

                                            <span
                                                className="cursor-pointer text-xl"
                                                onClick={() => toggleSave(freelancer._id)}
                                            >
                                                {saveList.includes(freelancer._id) ? "❤️" : "🤍"}
                                            </span>
                                        </div>

                                        <h2 className="text-lg font-bold">{freelancer.name}</h2>
                                        <p className="text-sm text-gray-600">
                                            {freelancer.skills?.join(", ")}
                                        </p>

                                        <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded">
                                            View Profile
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

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

                        {saveList.length === 0 && <p>No saved freelancers</p>}

                        {filteredFreelancers
                            .filter(f => saveList.includes(f._id))
                            .map((f) => (
                                <div key={f._id} className="bg-white p-4 rounded shadow mb-3">
                                    {f.name}
                                </div>
                            ))}
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

                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            messages.map((m) => (
                                <p
                                    key={m._id}
                                    className="bg-white p-3 rounded shadow mb-2"
                                >
                                    <strong>{m.fromName}:</strong> {m.text}
                                </p>
                            ))
                        )}
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
            </div>
        </div>
    );
};

export default ClientDashboard;
