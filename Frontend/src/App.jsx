import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import RolesSelect from "./pages/RolesSelect.jsx";
import AuthNavbar from "./components/AuthNavbar";
import HomeNavbar from "./components/HomeNavbar";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";
import FreelancerDashboard from "./pages/FreelancerDashboard.jsx";
import UserNavbar from "./components/UserNavbar.jsx";

function App() {
  const location = useLocation();

  const renderNavbar = () => {
    if (location.pathname === "/") {
      return <HomeNavbar />;
    } else if (
      location.pathname.startsWith("/login") ||
      location.pathname.startsWith("/roles") ||
      location.pathname.startsWith("/signup")
    ) {
      return <AuthNavbar />;
    }else if(location.pathname.startsWith("/clientDashboard") ||
    location.pathname.startsWith("/freelancerDashboard")){
      return <UserNavbar />;
    }
    return null;
  };

  return (
    <>
      {renderNavbar()}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/roles" element={<RolesSelect />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/clientDashboard"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancerDashboard"
          element={
            <ProtectedRoute allowedRole="freelancer">
              <FreelancerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
