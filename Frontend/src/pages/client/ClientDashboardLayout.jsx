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
import ProjectList from "./ProjectList.jsx";
import SaveList from "./Savelist.jsx";
import SeachResult from "./SearchResult.jsx";

const ClientDashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar for all client pages */}
      <ClientNavbar />

      {/* Client section routes */}
      <div className="bg-gray-100 min-h-[90vh]">
        <Routes>
          <Route path="/" element={<ClientDashboard />} />
          <Route path="/savelist" element={<SaveList />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/orders" element={<ClientOrders />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/profile" element={<ClientProfile />} />
          <Route path="/gig" element={<OpenGig />} />
          <Route path="/postproject" element={<PostProject />} />
          <Route path="/projectlist" element={<ProjectList />} />
          <Route path="/search" element={<SeachResult />} />
        </Routes>
      </div>
    </div>
  );
};

export default ClientDashboardLayout;
