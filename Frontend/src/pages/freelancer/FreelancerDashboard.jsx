import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import API from "../../api/api.js";
import ProjectCard from "../../components/ProjectCard.jsx";
import { ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";


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
    const [openIndex, setOpenIndex] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [freelancer, setFreelancer] = useState(null);
    const navigate = useNavigate();
    const [loadingFreelancer, setLoadingFreelancer] = useState(true);
    const [showMore, setShowMore] = useState(false);
    const scrollRef = React.useRef(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);


    useEffect(() => {
        const fetchFreelancer = async () => {
            try {
                const res = await API.get(`/freelancers/me`);
                setFreelancer(res.data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    console.warn("No freelancer profile found");
                    setFreelancer(null);
                } else {
                    console.error("Error loading freelancer data:", err);
                }
            } finally {
                setLoadingFreelancer(false);
            }
        };

        if (user?._id) fetchFreelancer();
    }, [user]);

    //Define fields
    const isProfileComplete =
        !!freelancer &&
        !!freelancer.freelancer?.headline?.trim() &&
        !!freelancer.freelancer?.location?.address?.trim() &&
        !!freelancer.freelancer?.location?.city?.trim() &&
        !!freelancer.freelancer?.location?.state?.trim() &&
        !!freelancer.freelancer?.location?.country?.trim() &&
        !!freelancer.freelancer?.profileImage?.url &&
        !!freelancer.freelancer?.about?.trim() &&
        Array.isArray(freelancer.freelancer?.skills) && freelancer.freelancer?.skills.length > 0 &&
        Array.isArray(freelancer.freelancer?.searchTags) && freelancer.freelancer?.searchTags.length > 0 &&
        Array.isArray(freelancer.freelancer?.portfolio) && freelancer.freelancer?.portfolio.length > 0;


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
        fetchProjects();
    }, []);


    const scrollContainer = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            const newScrollLeft =
                direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({
                left: newScrollLeft,
                behavior: "smooth",
            });
        }
    };

    // Track scroll position
    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setAtStart(scrollLeft <= 10);
        setAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
    };

    // Trigger on mount
    useEffect(() => {
        handleScroll();
    }, []);


    return (
        <>
            <div className="p-6 bg-linear-to-b from-green-100 to-transparent">
                <h1 className="font-bold text-3xl mb-4 ">
                    {user?.firstLogin ? (
                        <>
                            Welcome to Gig<span className="text-green-600">Connect</span>, {user?.name}
                        </>
                    ) : (
                        <>
                            Welcome back, <span className="text-green-600">{user?.name}</span>
                        </>
                    )}
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
                                <div className="font-semibold">Post your gig</div>
                                <div className="text-gray-500">Get hired according to your gigs</div>
                            </div>
                        </div>
                    </div>
                    {!loadingFreelancer && !isProfileComplete && (
                        <div
                            className="py-2.5 px-5 rounded-2xl min-w-1/4 bg-white shadow hover:shadow-lg transition cursor-pointer"
                            onClick={() => navigate("/freelancer/profile")}
                        >
                            <h1 className="text-sm font-sans font-semibold text-gray-500">
                                PROFILE PROGRESS
                            </h1>
                            <div className="flex items-center gap-2">
                                <div className="bg-gray-200 rounded-full p-2 flex items-center">
                                    <lord-icon
                                        src="https://cdn.lordicon.com/qlpudrww.json"
                                        colors="primary:#000000"
                                        className="w-6 h-6"
                                    ></lord-icon>
                                </div>
                                <div>
                                    <div className="font-semibold">Your profile is not completed</div>
                                    <div className="text-gray-500">
                                        Complete it to get tailored suggestion
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Projects Section */}
            <div className="p-6 pt-0">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Available Projects</h2>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    (() => {
                        const openProjects = projects.filter(
                            (p) => p.status?.toLowerCase() === "open"
                        );

                        if (openProjects.length === 0) {
                            return <p>No open projects available</p>;
                        }

                        return (
                            <>
                                {/*Large Screens: Horizontal Slide with Buttons */}
                                <div className="relative hidden md:block">
                                    {openProjects.length > 3 && (
                                        <>
                                            <button
                                                onClick={() => scrollContainer("left")}
                                                className={`absolute -left-6 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 rounded-full p-3 z-10 transition-opacity duration-300 ${atStart ? "opacity-0 pointer-events-none" : "opacity-100"
                                                    }`}
                                            >
                                                <ArrowLeft/>
                                            </button>
                                            <button
                                                onClick={() => scrollContainer("right")}
                                                className={`absolute -right-6 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 rounded-full p-3 z-10 transition-opacity duration-300 ${atEnd ? "opacity-0 pointer-events-none" : "opacity-100"
                                                    }`}
                                            >
                                                <ArrowRight/>
                                            </button>
                                        </>
                                    )}

                                    <div
                                        ref={scrollRef}
                                        onScroll={handleScroll}
                                        className="flex gap-6 overflow-hidden scroll-smooth pl-5"
                                        style={{ scrollBehavior: "smooth" }}
                                    >
                                        {openProjects.map((p) => (
                                            <div key={p._id} className="w-1/3 shrink-0">
                                                <ProjectCard project={p} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Small Screens: Column with Show More */}
                                <div className="md:hidden">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {openProjects
                                            .slice(0, showMore ? openProjects.length : 4)
                                            .map((p) => (
                                                <ProjectCard key={p._id} project={p} />
                                            ))}
                                    </div>

                                    {openProjects.length > 4 && (
                                        <div className="flex justify-center mt-4">
                                            <button
                                                onClick={() => setShowMore(!showMore)}
                                                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                            >
                                                {showMore ? "Show Less" : "Show More"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        );
                    })()
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
        </>
    );
};
export default FreelancerDashboard;
