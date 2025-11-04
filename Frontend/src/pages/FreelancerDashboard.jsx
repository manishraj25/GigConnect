import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext, useAuth } from "../context/AuthContext.jsx";
import API from "../api/api.js";
import Avtar from "../assets/profile.png";
import ProjectCard from "../components/ProjectCard.jsx";
import { ChevronDown } from "lucide-react";


const faqs = [
    {
        question: "What can I sell?",
        answer: "You can sell any digital service you’re skilled at — web development, design, writing, marketing, etc.",
    },
    {
        question: "How much time will I need to invest?",
        answer: "You can work as much or as little as you like. It’s completely flexible and depends on your availability.",
    },
    {
        question: "How much money can I make?",
        answer: "Your earnings depend on your skills, demand, and time commitment. Many freelancers earn part-time or even full-time income.",
    },
    {
        question: "How do I price my service?",
        answer: "Set your price based on project complexity, market rate, and your experience. You can always adjust later.",
    },
    {
        question: "How much does it cost?",
        answer: "Creating an account is free. Platform fees apply only when you complete a job or sell a service.",
    },
    {
        question: "How do I get paid?",
        answer: "Payments are securely processed and transferred to your linked account after project completion.",
    },
];

const FreelancerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [search, setSearch] = useState("");
    const { logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);
    const [projects, setProjects] = useState([]);
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

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const res = await API.get("/projects");
                setProjects(res.data.projects);
            } catch (err) {
                console.error("Error fetching projects:", err);
            } finally {
                setLoading(false);
            }
        };

        if (activeTab === "dashboard") {
            fetchProjects();
        }
    }, [activeTab]);

    // close profile menu when clicking outside
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

                        {/*Auto suggestions dropdown */}
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

                        {/* Avatar dropdown */}
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

                        {/*Projects */}
                        <div className="p-6 pt-0">
                            <h2 className="text-2xl font-semibold mb-4">Available Projects</h2>

                            {loading ? (
                                <p>Loading...</p>
                            ) : projects.length === 0 ? (
                                <p>No projects available</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pl-4">
                                    {projects.map((p) => (
                                        <ProjectCard key={p._id} project={p} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/*FAQ*/}
                        <section className="bg-gray-50 py-10">
                            <div className="max-w-6xl mx-auto px-4">
                                <h2 className="text-3xl font-bold text-center mb-12">Q&amp;A</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {faqs.map((faq, index) => (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                setOpenIndex(openIndex === index ? null : index)
                                            }
                                            className={`bg-white  shadow-sm border-l-4 transition-all duration-300 p-5 cursor-pointer group ${openIndex === index
                                                ? "border-green-500 shadow-md"
                                                : "border-transparent hover:border-green-500"
                                                }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-semibold text-lg text-gray-800">
                                                    {faq.question}
                                                </h3>
                                                <ChevronDown
                                                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === index ? "rotate-180 text-green-600" : ""
                                                        }`}
                                                />
                                            </div>

                                            <div
                                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-40 mt-3" : "max-h-0"
                                                    }`}
                                            >
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
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
                        <h1 className="text-2xl font-bold mb-4">Saved Projects</h1>
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
export default FreelancerDashboard;
