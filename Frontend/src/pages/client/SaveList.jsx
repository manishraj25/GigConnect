import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import API from "../../api/api.js"; 
import GigCard from "../../components/GigCard.jsx"; 

const SaveList = () => {
  const navigate = useNavigate();
  const [savedGigs, setSavedGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        const fetchSavedGigs = async () => {
            try {
                const res = await API.get("/savelist/saved");
                setSavedGigs(res.data.savedGigs); // array of saved gigs
            } catch (err) {
                console.error("Failed to fetch saved gigs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSavedGigs();
    }, []);
  console.log(savedGigs);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading your saved gigs...
      </div>
    );
  }

  const handleCardClick = (id) => {
        navigate(`/client/gigs/${id}`);
    };

  return (
    <div className="min-h-screen px-6 py-5">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/client")}
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold">Your SaveList</h1>
      </div>

      {savedGigs.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          You haven’t saved any gigs yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 w-full pl-4">
          {savedGigs.map((item) => (
            <div key={item.gig?._id || item._id} onClick={() => handleCardClick(item.gig?._id)}>
            <GigCard gig={item.gig} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SaveList;
