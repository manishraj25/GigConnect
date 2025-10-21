import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import RolesSelect from "./pages/RolesSelect.jsx";
import AuthNavbar from "./components/AuthNavbar";
import HomeNavbar from "./components/HomeNavbar";

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
      </Routes>
    </>
  );
}

export default App;
