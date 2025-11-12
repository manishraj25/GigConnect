// FreelancerProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api.js";
import Avtar from "../../assets/profile.png";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion,} from "framer-motion";

const FreelancerProfile = () => {
  const { id } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [portfolioIndex, setPortfolioIndex] = useState(0);
  const [imageIndexes, setImageIndexes] = useState({});
  const [cardsPerView, setCardsPerView] = useState(1);

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

        // initialize image index for each portfolio card
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

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!freelancer) return <p className="text-center mt-10">Freelancer not found</p>;

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
            <div className="flex gap-2">
            <h1 className="text-2xl font-bold">{freelancer.user?.name}</h1>
            <span className="flex items-center gap-1 text-yellow-500">
                <Star /> 4.8
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

      {/* Reviews */}
      {freelancer.reviews?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Reviews</h3>
          <div className="space-y-2">
            {freelancer.reviews.map((review, idx) => (
              <div key={idx} className="border p-3 rounded">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{review.userName}</span>
                  <span className="text-yellow-500 flex items-center gap-1">
                    <Star /> {review.rating}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
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

    </div>
  );
};

export default FreelancerProfile;
