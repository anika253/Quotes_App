import { Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import OTP from "./pages/OTP";
import PurposeSelection from "./pages/PurposeSelection";
import ProfileSetup from "./pages/ProfileSetup";
import Home from "./pages/Home";
import EditDesign from "./pages/EditDesign";
import Upgrade from "./pages/Upgrade";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      {/* Onboarding */}
      <Route path="/" element={<Welcome />} />
      <Route path="/otp" element={<OTP />} />
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
