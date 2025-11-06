import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api.js"; // axios instance
import { motion } from "framer-motion";
import { MessageSquare, Heart } from "lucide-react";
import Avtar from "../../assets/profile.png";
import Hero from "../../assets/hero.jpg";

const OpenGig = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false); // state to track if gig is saved

    useEffect(() => {
        const fetchGig = async () => {
            try {
                const res = await API.get(`/gigs/${id}`);
                setGig(res.data);

                // check if gig is already saved by client
                const savedRes = await API.get("/savelist/saved");
                const isSaved = savedRes.data.savedGigs.some(s => s.gig._id === id);
                setSaved(isSaved);

            } catch (error) {
                console.error("Error fetching gig:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGig();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg font-medium">Loading gig details...</p>
            </div>
        );
    }

    if (!gig) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg font-medium text-red-500">Gig not found</p>
            </div>
        );
    }

    const handleMessageClick = () => {
        const freelancerId = gig.freelancer?.user?._id;
        if (freelancerId) {
            navigate(`/client/messages?chatWith=${freelancerId}`);
        } else {
            alert("Freelancer not found for this gig");
        }
    };

    const openFreelancerProfile = (id) => {
        navigate(`/client/freelancerprofile/${id}`);
    };

    const handleSaveGig = async () => {
        try {
            if (saved) {
                // remove saved gig
                await API.delete(`/savelist/save/${id}`);
                setSaved(false);
            } else {
                // save gig
                await API.post(`/savelist/save/${id}`);
                setSaved(true);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to save gig.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-5 bg-white shadow-md rounded-2xl p-6">

            {/* Top Section - Freelancer Info */}
            <div className="flex flex-col md:flex-row items-center justify-between p-4 gap-4">
                {/* Left: Profile Info */}
                <div className="flex items-center gap-5">
                    <img
                        src={gig.freelancer?.profileImage?.url || Avtar}
                        alt="Freelancer"
                        className="w-20 h-20 rounded-full object-cover border cursor-pointer"
                        onClick={() => openFreelancerProfile(gig.freelancer?._id)}
                    />
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                            {gig.freelancer?.user?.name}
                            <span className="text-yellow-500 text-lg">★ {gig.freelancer?.rating || "4.8"}</span>
                        </h2>
                        <p className="text-gray-500">{gig.freelancer?.location?.city}, {gig.freelancer?.location?.state || "Unknown Location"}</p>
                    </div>
                </div>

                {/* Right: Buttons */}
                <div className="flex gap-3 mt-4 md:mt-0">
                    <motion.button
                        onClick={handleMessageClick}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow transition-all duration-200"
                    >
                        <MessageSquare size={18} />
                        Message
                    </motion.button>

                    <motion.button
                        onClick={handleSaveGig}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow transition-all duration-200 ${
                            saved ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        }`}
                    >
                        <Heart size={18} />
                        {saved ? "Saved" : "Save"}
                    </motion.button>
                </div>
            </div>

            {/* Gig Title */}
            <div className="pl-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">{gig.title}</h1>
            </div>

            {/* Image Slider */}
            {gig.images && gig.images.length > 0 && (
                <div className="relative w-full overflow-x-auto flex gap-4 pb-2">
                    {gig.images.map((img, index) => (
                        <div
                            key={index}
                            className="min-w-[300px] sm:min-w-[400px] rounded-2xl overflow-hidden shadow-md shrink-0"
                        >
                            <img
                                src={img.url || Hero}
                                alt={`Gig ${index}`}
                                className="w-full h-64 object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Description */}
            <div className="p-4 ">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Description</h2>
                <p className="text-gray-600 leading-relaxed">{gig.description}</p>
            </div>

            {/* Price Section */}
            <div className="flex justify-between items-center p-4">
                <p className="text-2xl font-bold text-blue-600">
                    ₹{gig.price?.starting || gig.price}
                </p>
                <p className="text-gray-700 font-medium">
                    ⏱ {gig.deliveryTime} days delivery
                </p>
            </div>

        </div>
    );
};

export default OpenGig;
