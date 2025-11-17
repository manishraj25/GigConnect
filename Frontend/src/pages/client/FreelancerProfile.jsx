// FreelancerProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api.js";
import Avtar from "../../assets/profile.png";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";

const FreelancerProfile = () => {
  const { id } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [portfolioIndex, setPortfolioIndex] = useState(0);
  const [imageIndexes, setImageIndexes] = useState({});
  const [cardsPerView, setCardsPerView] = useState(1);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const { user } = useAuth();

  // Adjust number of visible cards based on window size
  const updateCardsPerView = () => {
    if (window.innerWidth >= 1024) setCardsPerView(3);
    else if (window.innerWidth >= 768) setCardsPerView(2);
    else setCardsPerView(1);
  };

  useEffect(() => {
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        const res = await API.get(`/freelancers/${id}`);
        setFreelancer(res.data);

        const initialIndexes = {};
        res.data.portfolio?.forEach((_, i) => {
          initialIndexes[i] = 0;
        });
        setImageIndexes(initialIndexes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFreelancer();
  }, [id]);


  // Fetch reviews for the freelancer
    const fetchReviews = async () => {
        try {
            const freelancerId = freelancer?._id;
            if (!freelancerId) return;

            const res = await API.get(`/reviews/freelancer/${freelancerId}`);
            setReviews(res.data.reviews);
        } catch (error) {
            console.error("Failed to load reviews", error);
        }
    };

    useEffect(() => {
        if (freelancer?._id) fetchReviews();
    }, [freelancer]);


    // Submit a review
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setLoadingReview(true);

        try {
            await API.post("/reviews", {
                freelancerId: freelancer?._id,
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


  // Portfolio image toggle
  const togglePortfolioImage = (cardIdx, direction) => {
    const images = freelancer.portfolio[cardIdx].photos;
    setImageIndexes((prev) => {
      const newIndex =
        direction === "next"
          ? (prev[cardIdx] + 1) % images.length
          : (prev[cardIdx] - 1 + images.length) % images.length;
      return { ...prev, [cardIdx]: newIndex };
    });
  };

  // Scroll portfolio cards
  const scrollPortfolio = (direction) => {
    const total = freelancer.portfolio.length;
    setPortfolioIndex((prev) => {
      if (direction === "next") return Math.min(prev + 1, total - cardsPerView);
      return Math.max(prev - 1, 0);
    });
  };


  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!freelancer) return <p className="text-center mt-10">Freelancer not found</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-gray-50 shadow">

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-3 gap-4">
        <div className="flex items-center gap-4">
          <img
            src={freelancer.profileImage?.url || Avtar}
            alt={freelancer.user?.name}
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <div className="flex gap-2 items-center">
              <h1 className="text-2xl font-bold">{freelancer.user?.name}</h1>
              <span className="flex items-center gap-1 text-yellow-500 text-xl">
                ★ {freelancer.averageRating || "0.0"}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{freelancer?.location?.city}, {freelancer?.location?.state || "Unknown Location"}</p>
          </div>
        </div>
        <button className="mt-4 md:mt-0 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Hire
        </button>
      </div>

      {/* Headline */}
      {freelancer.headline && (
        <h2 className="text-xl font-semibold text-gray-800">{freelancer.headline}</h2>
      )}

      {/* About */}
      <div>
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <p className="text-gray-700">{freelancer.about || "No description provided."}</p>
      </div>

      {/* Skills */}
      {freelancer.skills?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {freelancer.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio */}
      {freelancer.portfolio?.length > 0 && (
        <div className="mt-6 relative w-full">
          <h3 className="text-lg font-semibold mb-2">Portfolio</h3>

          <div className="relative flex items-center">
            {/* Portfolio Cards with motion */}
            <motion.div
              key={portfolioIndex}
              className="flex gap-4 w-full overflow-hidden"
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.25 }}
            >
              {freelancer.portfolio
                .slice(portfolioIndex, portfolioIndex + cardsPerView)
                .map((item, idx) => {
                  const imageIndex = imageIndexes[idx + portfolioIndex] || 0;
                  return (
                    <div
                      key={idx + portfolioIndex}
                      className="rounded-lg  max-w-1/3 shadow-md relative p-3 my-1.5 bg-white"
                    >
                      {/* Project Image */}
                      {item.photos?.length > 0 ? (
                        <div className="relative">
                          <img
                            src={item.photos[imageIndex]?.url || Avtar}
                            alt={item.heading || "Portfolio Image"}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />

                          {/* Image toggle buttons */}
                          {item.photos.length > 1 && (
                            <>
                              <button
                                onClick={() => togglePortfolioImage(idx + portfolioIndex, "prev")}
                                className="absolute top-1/2 -translate-y-1/2 left-2 bg-white p-1 rounded-full shadow hover:bg-gray-100 z-10"
                              >
                                <ChevronLeft />
                              </button>
                              <button
                                onClick={() => togglePortfolioImage(idx + portfolioIndex, "next")}
                                className="absolute top-1/2 -translate-y-1/2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100 z-10"
                              >
                                <ChevronRight />
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
                          No Image
                        </div>
                      )}

                      {/* Card Content */}
                      <div className="p-3">
                        <h4 className="font-semibold mb-1">{item.heading || "Untitled Project"}</h4>
                        <p className="text-gray-700 text-sm">{item.description || "No description available."}</p>
                      </div>
                    </div>
                  );
                })}
            </motion.div>

            {/* Scroll Buttons overlapping cards */}
            {portfolioIndex > 0 && (
              <button
                onClick={() => scrollPortfolio("prev")}
                className="absolute top-1/2 -translate-y-1/2 left-0 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-20"
              >
                <ChevronLeft />
              </button>
            )}
            {portfolioIndex + cardsPerView < freelancer.portfolio.length && (
              <button
                onClick={() => scrollPortfolio("next")}
                className="absolute top-1/2 -translate-y-1/2 right-0 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-20"
              >
                <ChevronRight />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Contact Info */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Contact Info</h3>
        <p className="px-3"><span className="font-semibold">Email:</span> {freelancer.user?.email}</p>
      </div>

      {/* Search Tags */}
      {freelancer.searchTags?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Related Search Tags</h3>
          <div className="flex flex-wrap gap-2">
            {freelancer.searchTags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-green-50 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}



      {/* REVIEW SECTION */}
      <div className="">

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

export default FreelancerProfile;
