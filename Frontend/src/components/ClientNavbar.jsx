import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext, useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";
import Avtar from "../assets/profile.png";

const ClientNavbar = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useAuth();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [clientProfile, setClientProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const menuRef = useRef(null);
  const navigate = useNavigate();

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

  // Fetch client profile
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const res = await API.get("/clients/me");
        setClientProfile(res.data);
      } catch (err) {
        console.error("Error loading client profile in navbar:", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [user]);

  // close dropdown when clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // suggestions
  const handleTyping = (e) => {
    const text = e.target.value;
    setSearch(text);
    if (!text) return setSuggestions([]);

    const filtered = categories.filter((c) =>
      c.toLowerCase().includes(text.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const applySuggestion = (value) => {
    setSearch(value);
    setSuggestions([]);
  };

  const handleSearch = () => {
    if (search.trim() !== "") {
      navigate(`/client/search?query=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50">
      <div className="flex px-4 sm:px-8 justify-between bg-gray-100 items-center py-3 sm:py-4 w-full text-black border-b border-gray-200">
        <h1
          onClick={() => navigate("/client")}
          className="text-lg sm:text-xl font-bold cursor-pointer"
        >
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
            onClick={handleSearch}
          >
            <lord-icon
              src="https://cdn.lordicon.com/xaekjsls.json"
              trigger="hover"
              colors="primary:#ffffff"
              className="w-7 h-6"
            ></lord-icon>
          </button>

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
          <button onClick={() => navigate("/client/notifications")} className="cursor-pointer w-5 h-5">
            <lord-icon src="https://cdn.lordicon.com/ahxaipjb.json" colors="primary:#000000"></lord-icon>
          </button>
          <button onClick={() => navigate("/client/messages")} className="cursor-pointer w-5 h-5">
            <lord-icon src="https://cdn.lordicon.com/bpptgtfr.json" colors="primary:#000000"></lord-icon>
          </button>
          <button onClick={() => navigate("/client/savelist")} className="cursor-pointer w-5 h-5">
            <lord-icon src="https://cdn.lordicon.com/hsabxdnr.json" colors="primary:#000000"></lord-icon>
          </button>
          <button onClick={() => navigate("/client/orders")} className="hover:text-green-600 hover:underline cursor-pointer">
            Orders
          </button>

          {/* Avatar dropdown */}
          <div className="relative" ref={menuRef}>
            <img
              src={clientProfile?.profileImage?.url || Avtar}
              className="w-8 h-8 rounded-full cursor-pointer object-cover"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <div className="absolute right-1 mt-4 w-52 bg-white shadow rounded border z-50">
                <button
                  className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                  onClick={() => {
                    navigate("/client/profile");
                    setMenuOpen(false);
                  }}
                >
                  Your Profile
                </button>
                <button
                  className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                  onClick={() => {
                    navigate("/client/postproject");
                    setMenuOpen(false);
                  }}
                >
                  Post Project Brief
                </button>
                <button
                  className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                  onClick={() => {
                    navigate("/client/postproject");
                    setMenuOpen(false);
                  }}
                >
                  Your Project Briefs
                </button>
                <button
                  onClick={() => navigate("/client/transactions")}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                >
                  Your transactions
                </button>
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
  );
};

export default ClientNavbar;
