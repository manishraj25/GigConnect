import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import API from "../../api/api.js";
import GigCard from "../../components/GigCard.jsx";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [gigs, setGigs] = useState([]);
    const [selectCategories, setSelectCategories] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate =useNavigate();


    const categories = [
        "Web Developer",
        "Web Development",
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
                const fetched = Array.isArray(res.data) ? res.data : res.data.gigs;
                setGigs(fetched || []);
            } catch (err) {
                console.error("Error fetching gigs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllGigs();
    }, []);

    //Handle category change
    const handleCategories = (event) => {
        setSelectCategories(event.target.value);
    };



    //Filter gigs based on selected category
    const displayedGigs = gigs.filter((gig) =>
        selectCategories
            ? gig.category?.toLowerCase() === selectCategories.toLowerCase()
            : true
    );

    const handleCardClick = (id) => {
        navigate(`/client/gigs/${id}`);
    };


    return (
        <>
            <div className="p-6 bg-linear-to-b from-green-100 to-transparent">
                <h1 className="font-bold text-3xl mb-4 ">
                    Welcome to Gig<span className="text-green-600">Connect</span>, {user?.name}
                </h1>
                <div className="flex gap-5 mb-6 ml-5 ">
                    <div className="py-2.5 px-5 rounded-2xl min-w-1/4 bg-white shadow hover:shadow-lg transition cursor-pointer"
                         onClick={()=>navigate("/client/postproject")}>
                        <h1 className="text-sm font-sans font-semibold text-gray-500">RECOMMENDED FOR YOU</h1>
                        <div className="flex items-center gap-2">
                            <div className="bg-gray-200 rounded-full p-2 flex items-center"><lord-icon
                                src="https://cdn.lordicon.com/mubdgyyw.json"
                                colors="primary:#000000"
                                className="w-6 h-6">
                            </lord-icon></div>
                            <div>
                                <div className="font-semibold">Post a project brief</div>
                                <div className="text-gray-500" >Get offers for your needs</div>
                            </div>
                        </div>
                    </div>
                    <div className="py-2.5 px-5 rounded-2xl min-w-1/4 bg-white shadow hover:shadow-lg transition cursor-pointer"
                         onClick={()=>navigate("/client/profile")}>
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
                                    <div key={gig._id} className="min-w-[250px] shrink-0" onClick={() => handleCardClick(gig._id)}>
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
        </>
    )
};
export default ClientDashboard;