import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";


const GigCard = ({ gig }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = gig?.images?.length ? gig.images : [];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white w-[250px] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100">
      <div className="relative h-[150px] overflow-hidden group">
        {images.length > 0 ? (
          <img
            src={images[currentIndex]?.url}
            alt={gig.title}
            className="w-full h-full object-cover transition-all duration-500"
          />
        ) : (
          <img
            src="https://via.placeholder.com/250x150?text=No+Image"
            alt="no-image"
            className="w-full h-full object-cover"
          />
        )}

        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md hover:scale-110 transition">
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md hover:scale-110 transition">
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </>
        )}

        <button
          className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:scale-110 transition"
        >
          <Heart
            className={`w-4 h-4`}// ${isSaved ? "text-red-500 fill-red-500" : "text-gray-700"}
          />
        </button>
      </div>

      <div className="p-3 space-y-1.5">
        <div className="flex items-center gap-2">
          <img
            src={gig.freelancer?.profileImage?.url || "https://via.placeholder.com/40"}
            alt="profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <h4 className="text-[14px] font-semibold leading-tight text-gray-800">
            {gig.freelancer?.user?.name || "Unknown"}
          </h4>
        </div>
        <h3 className="text-[14px] font-medium text-gray-800 line-clamp-2 hover:underline">
          {gig.title}
        </h3>
        <div className="flex items-center text-sm text-gray-700">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="ml-1 font-semibold">{gig.rating || "5.0"}</span>
          <span className="text-gray-500 ml-1">({gig.reviews || 739})</span>
        </div>
        <p className="text-[14px] font-semibold text-gray-800 mt-2">
          From ₹{gig.price?.toLocaleString() || "7,894"}
        </p>
      </div>
    </div>
  );
};

export default GigCard;
