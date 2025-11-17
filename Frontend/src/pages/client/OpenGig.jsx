import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api.js";
import { motion } from "framer-motion";
import { MessageSquare, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import Avtar from "../../assets/profile.png";
import Hero from "../../assets/hero.jpg";
import { useAuth } from "../../context/AuthContext.jsx";

const OpenGig = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const { user } = useAuth();

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loadingReview, setLoadingReview] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const scrollRef = useRef(null);



    useEffect(() => {
        const fetchGig = async () => {
            try {
                const res = await API.get(`/gigs/${id}`);
                setGig(res.data);

                const savedRes = await API.get("/savelist/saved/gigs");
                const isSaved = savedRes.data.savedGigs.some(
                    s => s.gig._id === id
                );
                setSaved(isSaved);

            } catch (error) {
                console.error("Error fetching gig:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGig();
    }, [id]);




    // Fetch reviews for the freelancer
    const fetchReviews = async () => {
        try {
            const freelancerId = gig?.freelancer?._id;
            if (!freelancerId) return;

            const res = await API.get(`/reviews/freelancer/${freelancerId}`);
            setReviews(res.data.reviews);
        } catch (error) {
            console.error("Failed to load reviews", error);
        }
    };

    useEffect(() => {
        if (gig?.freelancer?._id) fetchReviews();
    }, [gig]);


    // Submit a review
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setLoadingReview(true);

        try {
            await API.post("/reviews", {
                freelancerId: gig?.freelancer?._id,
                gigId: gig?._id,
                rating,
                comment,
            });

            setRating(0);
            setComment("");

            fetchReviews();
        } catch (error) {
            console.log("Error posting review:", error);
        }

        setLoadingReview(false);
    };


    // Delete review
    const handleDeleteReview = async (id) => {
        if (!confirm("Delete this review?")) return;

        try {
            await API.delete(`/reviews/${id}`);
            fetchReviews();
        } catch (error) {
            console.log(error);
        }
    };


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
                await API.delete(`/savelist/gig/${id}`);
                setSaved(false);
            } else {
                await API.post(`/savelist/gig/${id}`);
                setSaved(true);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to save gig.");
        }
    };


    const handlePrev = () => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({
            left: -300,
            behavior: "smooth",
        });
    };

    const handleNext = () => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({
            left: 300,
            behavior: "smooth",
        });
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
                            <span className="text-yellow-500 text-lg">★ {gig.freelancer?.averageRating || "0.0"}</span>
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
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow transition-all duration-200 ${saved ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
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

            {/* IMAGE VIEWER*/}
            {gig.images && gig.images.length > 0 && (
                <div className="relative w-full px-4 py-4">
                    <button
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 
                       bg-green-500 p-2 rounded-full shadow 
                       hover:bg-green-600 z-20"
                    >
                        <ChevronLeft size={26} className="text-white" />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-scroll scroll-smooth no-scrollbar"
                    >
                        {gig.images.map((img, index) => (
                            <div
                                key={index}
                                className="rounded-xl overflow-hidden shadow-lg 
                               shrink-0 
                               w-full sm:w-1/2"
                            >
                                <img
                                    src={img.url || Hero}
                                    alt={`Gig-${index}`}
                                    className="w-full h-72 object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 
                       bg-green-500 p-2 rounded-full shadow 
                       hover:bg-green-600 z-20"
                    >
                        <ChevronRight size={26} className="text-white" />
                    </button>
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


            {/* REVIEW SECTION */}
            <div className="p-4">

                {/* REVIEWS LIST */}
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

                {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet.</p>
                ) : (
                    <>
                        {(showAll ? reviews : [reviews[0]]).map((rev) => (
                            <div key={rev._id} className="border-b pb-3 mb-3">
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{rev.reviewer.name}</span>

                                        {/* Stars */}
                                        <span className="flex">
                                            {Array.from({ length: rev.rating }).map((_, i) => (
                                                <span key={i} className="text-yellow-500 text-lg">★</span>
                                            ))}
                                        </span>
                                    </div>

                                    {/* Delete only if reviewer matches user */}
                                    {user?._id === rev.reviewer._id && (
                                        <button
                                            onClick={() => handleDeleteReview(rev._id)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>

                                <p className="text-gray-700 mt-1">{rev.comment}</p>
                                <p className="text-xs text-gray-400">
                                    {new Date(rev.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}

                        {/* Toggle buttons */}
                        {reviews.length > 1 && !showAll && (
                            <button
                                onClick={() => setShowAll(true)}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Show All Reviews ({reviews.length})
                            </button>
                        )}

                        {showAll && (
                            <button
                                onClick={() => setShowAll(false)}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Show Less
                            </button>
                        )}
                    </>
                )}

                {/* ADD REVIEW SECTION FIRST */}
                {user?.role === "client" && (
                    <form onSubmit={handleSubmitReview} className="mb-8">
                        <h3 className="text-xl font-semibold mb-3">Write a Review</h3>

                        {/* Rating Input */}
                        <div className="flex gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <span
                                    key={num}
                                    onClick={() => setRating(num)}
                                    className={`text-3xl cursor-pointer ${rating >= num ? "text-yellow-500" : "text-gray-300"
                                        }`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        {/* Comment */}
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your review..."
                            className="w-full border rounded-lg p-3 min-h-[90px]"
                            required
                        />

                        <button
                            className="bg-green-600 text-white mt-3 px-5 py-2 rounded-lg hover:bg-green-700"
                            disabled={loadingReview}
                        >
                            {loadingReview ? "Posting..." : "Submit Review"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default OpenGig;
