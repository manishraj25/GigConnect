import React from "react";
import { Routes, Route } from "react-router-dom";
import ClientNavbar from "../../components/ClientNavbar.jsx";
import ClientDashboard from "./ClientDashboard.jsx";
import ClientProfile from "./ClientProfile.jsx";
import Messages from "../Messages.jsx";
import Notifications from "./Notifications.jsx";
import Transactions from "./Transactions.jsx";
import OpenGig from "./OpenGig.jsx";
import PostProject from "./PostProject.jsx";
import ClientOrders from "./ClientOrders.jsx";
import SaveList from "./Savelist.jsx";
import SeachResult from "./SearchResult.jsx";
import FreelancerProfile from "./FreelancerProfile.jsx";
import Proposals from "./Proposals.jsx";

const ClientDashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar for all client pages */}
      <ClientNavbar />

      {/* Client section routes */}
      <div className="bg-gray-100 min-h-[90vh] py-4">
        <Routes>
          <Route path="/" element={<ClientDashboard />} />
          <Route path="/savelist" element={<SaveList />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/orders" element={<ClientOrders />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/profile" element={<ClientProfile />} />
          <Route path="/gigs/:id" element={<OpenGig />} />
          <Route path="/postproject" element={<PostProject />} />
          <Route path="/search" element={<SeachResult />} />
          <Route path="/freelancerprofile/:id" element={<FreelancerProfile/>}/>
          <Route path="/proposals" element={<Proposals/>}/>
        </Routes>
      </div>
    </div>
  );
};

export default ClientDashboardLayout;
