import React from "react";
import { Routes, Route } from "react-router-dom";
import FreelancerDashboard from "./FreelancerDashboard";
import FreelancerNavbar from "../../components/FreelancerNavbar";
import FreelancerProfile from "./FreelancerProfile";
import Messages from "../Messages";
import SavedProjects from "./SavedProjects";
import SearchResult from "./SearchResult";
import PostGig from "./PostGig";


const FreelancerDashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar for all freelancer pages */}
      <FreelancerNavbar />

      {/* freelancer section routes */}
      <div className="bg-gray-100 min-h-[90vh]">
        <Routes>
          <Route path="/" element={<FreelancerDashboard />} />
          <Route path="/profile" element={<FreelancerProfile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/savedprojects" element={<SavedProjects />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/postgig" element={<PostGig />} />
        </Routes>
      </div>
    </div>
  );
};

export default FreelancerDashboardLayout;
