import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext, useAuth } from "../context/AuthContext.jsx";
import API from "../api/api.js"
import Avtar from "../assets/profile.png";
import GigCard from "../components/GigCard.jsx";

const ClientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [gigs, setGigs] = useState([]);
    const [search, setSearch] = useState("");
    const { logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const [selectCategories, setSelectCategories] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);



    const menuRef = useRef(null);


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
        const fetchAllGigs = async () => {
            setLoading(true);
            try {
                const res = await API.get(`/gigs`);
                console.log("Fetched gigs:", res.data);

                // Some APIs return array, some return { gigs: [...] }
                const fetched = Array.isArray(res.data) ? res.data : res.data.gigs;
                setGigs(fetched || []);
            } catch (err) {
                console.error("Error fetching gigs:", err);
            } finally {
                setLoading(false);
            }
        };
        if (activeTab === "dashboard") fetchAllGigs();
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

    //Filter gigs based on selected category
    const displayedGigs = gigs.filter((gig) =>
        selectCategories
            ? gig.category?.toLowerCase() === selectCategories.toLowerCase()
            : true
    );


    return (
        <div className="min-h-screen bg-gray-100">
            {/* ------------------ NAVBAR ------------------ */}
            <nav className="sticky top-0 z-50">
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

                                    <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">Your transactions</button>

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
                            <h2 className="text-2xl font-medium">
                                Explore freelancers
                            </h2>

                            <select id="categories" value={selectCategories} onChange={handleCategories} className="border border-gray-400 mt-2 p-1 rounded-md">
                                <option value="">All Domains</option>
                                {categories.map((categorie) => (
                                    <option key={categorie} value={categorie}>
                                        {categorie}
                                    </option>
                                ))}
                            </select>

                            {loading ? (
                                <p>Loading gigs...</p>
                            ) : displayedGigs.length === 0 ? (
                                <p className="text-gray-600">No gigs found.</p>
                            ) : (
                                <>
                                    {/* Mobile: vertical list (show up to 5) */}
                                    < div className="grid grid-cols-1 gap-4 sm:hidden mt-6 px-3">
                                        {displayedGigs.slice(0, 5).map((gig) => (
                                            <GigCard key={gig._id} gig={gig} />
                                        ))}
                                    </div>

                                    {/* Desktop/Tablet: horizontal scroll with Prev/Next buttons */}
                                    <div className="hidden sm:block relative mt-6 px-3">
                                        <div
                                            id="gigScrollContainer"
                                            className="flex gap-4 overflow-hidden scroll-smooth"
                                            onScroll={(e) => {
                                                const container = e.target;
                                                const prevBtn = document.getElementById("prevButton");
                                                if (container.scrollLeft > 50) {
                                                    prevBtn.classList.remove("opacity-0", "pointer-events-none");
                                                } else {
                                                    prevBtn.classList.add("opacity-0", "pointer-events-none");
                                                }
                                            }}
                                        >
                                            {displayedGigs.map((gig) => (
                                                <div key={gig._id} className="min-w-[250px] flex-shrink-0">
                                                    <GigCard gig={gig} />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Prev Button */}
                                        <button
                                            id="prevButton"
                                            onClick={() => {
                                                const container = document.getElementById("gigScrollContainer");
                                                container.scrollBy({ left: -800, behavior: "smooth" });
                                            }}
                                            className="absolute top-1/2 left-3 -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition opacity-0 pointer-events-none z-10"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-5 h-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        {/* Next Button */}
                                        <button
                                            onClick={() => {
                                                const container = document.getElementById("gigScrollContainer");
                                                container.scrollBy({ left: 800, behavior: "smooth" });
                                            }}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition z-10"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-5 h-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </>

                            )}
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
        </div >
    );
};
export default ClientDashboard;
