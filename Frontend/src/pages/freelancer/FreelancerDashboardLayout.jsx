import React from "react";
import { Routes, Route } from "react-router-dom";
import FreelancerDashboard from "./FreelancerDashboard";
import FreelancerNavbar from "../../components/FreelancerNavbar";
import FreelancerProfile from "./FreelancerProfile";
import Messages from "../Messages";


const ClientDashboardLayout = () => {
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
          {/* <Route path="/savelist" element={<SaveList />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/orders" element={<ClientOrders />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/profile" element={<ClientProfile />} />
          <Route path="/gigs/:id" element={<OpenGig />} />
          <Route path="/postproject" element={<PostProject />} />
          <Route path="/projectlist" element={<ProjectList />} />
          <Route path="/search" element={<SeachResult />} />
          <Route path="/freelancerprofile/:id" element={<FreelancerProfile/>}/> */}
        </Routes>
      </div>
    </div>
  );
};

export default ClientDashboardLayout;
