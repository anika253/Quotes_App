import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "./api";

import Welcome from "./pages/Welcome";
import PurposeSelection from "./pages/PurposeSelection";
import ProfileSetup from "./pages/ProfileSetup";
import Home from "./pages/Home";
import EditDesign from "./pages/EditDesign";
import Upgrade from "./pages/Upgrade";
import Profile from "./pages/Profile";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const publicPaths = ["/"];
      
      if (token) {
        try {
          const response = await api.checkAuth();
          if (response.data.user) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
            // If user is logged in and on root path, redirect to home
            // This is normal behavior - logged in users go to home page
            if (location.pathname === "/") {
              navigate("/home", { replace: true });
            }
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (!publicPaths.includes(location.pathname)) {
            navigate("/");
          }
        }
      } else {
        // No token, if on protected path, redirect to login
        if (!publicPaths.includes(location.pathname)) {
          navigate("/");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate, location.pathname]);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Routes>
      {/* Onboarding */}
      <Route path="/" element={<Welcome />} />
      <Route path="/purpose" element={<PurposeSelection />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/upgrade" element={<Upgrade />} />
      <Route path="/profile" element={<Profile />} />

      {/* Main App */}
      <Route path="/home" element={<Home />} />
      <Route path="/edit" element={<EditDesign />} />
    </Routes>
  );
}

export default App;
