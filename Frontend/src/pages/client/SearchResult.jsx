import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api/api.js";
import GigCard from "../../components/GigCard.jsx";
import { ArrowLeft } from "lucide-react";

const SearchResult = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        minPrice: "",
        maxPrice: "",
        location: "",
    });
    const navigate = useNavigate();

    const locationHook = useLocation();
    const query = new URLSearchParams(locationHook.search).get("query");

    // Fetch results based on query + filters
    const fetchResults = async () => {
        if (!query) return;
        setLoading(true);

        try {
            const { minPrice, maxPrice, location } = filters;

            const res = await API.get(`/search/freelancers`, {
                params: {
                    searchTag: query,
                    minPrice: minPrice || undefined,
                    maxPrice: maxPrice || undefined,
                    location: location || undefined,
                },
            });

            setResults(res.data.gigs || []);
        } catch (err) {
            console.error("Search error:", err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [query, filters]);

    // Handle input change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleCardClick = (id) => {
        navigate(`/client/gigs/${id}`);
    };

    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-2">
                <button
                    onClick={() => navigate("/client")}
                    className="p-2 hover:bg-gray-200 rounded-full transition cursor-pointer"
                >
                    <ArrowLeft size={22} />
                </button>
                <h2 className="text-2xl font-semibold">
                    Search Results for “{query}”
                </h2>
            </div>

            {/* Filter Section */}
            <div className="flex flex-wrap items-center gap-4 mb-6 bg-gray-100 p-4 rounded-lg">
                <input
                    type="number"
                    name="minPrice"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="border rounded px-3 py-2 w-32"
                />

                <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="border rounded px-3 py-2 w-32"
                />

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="border rounded px-3 py-2 w-40"
                />

                <button
                    onClick={fetchResults}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    Apply Filters
                </button>

                <button
                    onClick={() =>
                        setFilters({ minPrice: "", maxPrice: "", location: "" })
                    }
                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                >
                    Clear
                </button>
            </div>

            {/* Results Section */}
            {loading ? (
                <p>Loading...</p>
            ) : results.length === 0 ? (
                <p>No freelancers found.</p>
            ) : (
                <div className="flex flex-wrap gap-4 justify-center">
                    {results.map((gig) => (
                        <div key={gig._id} className="w-full sm:w-[48%] md:w-[30%] lg:w-[22%]" onClick={() => handleCardClick(gig._id)}>
                            <GigCard gig={gig} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResult;
