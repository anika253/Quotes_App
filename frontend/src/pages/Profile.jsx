import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User, Edit3, Download, ArrowLeft, Image } from "lucide-react";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const purpose = localStorage.getItem("purpose");
  const userName = localStorage.getItem("userName");
  const businessName = localStorage.getItem("businessName");
  const userImage = localStorage.getItem("userImage");
  const phone = localStorage.getItem("phone");

  const displayName = purpose === "BUSINESS" ? businessName : userName;

  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    // ✅ session-only downloads
    const saved = JSON.parse(sessionStorage.getItem("downloads") || "[]");
    setDownloads(saved);
  }, []);

  return (
    <div className="profile-container">
      {/* Decorative Blurs */}
      <div className="blur-top" />
      <div className="blur-bottom" />

      {/* Back */}
      <button className="back-btn" onClick={() => navigate("/home")}>
        <ArrowLeft />
      </button>

      {/* Card */}
      <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <div className="avatar-wrapper">
            {userImage ? (
              <img src={userImage} alt="Profile" className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                <User />
              </div>
            )}
          </div>

          <h2>{displayName || "Your Name"}</h2>
          <p className="phone">{phone || "+91 XXXXXXXXXX"}</p>

          <button className="edit-btn" onClick={() => navigate("/edit")}>
            <Edit3 /> Edit Profile
          </button>
        </div>

        {/* Downloads */}
        <div className="downloads-section">
          <div className="downloads-title">
            <Download />
            <h3>Downloaded Quotes</h3>
          </div>

          {downloads.length === 0 ? (
            <div className="empty-downloads">
              <Image />
              <p>No downloaded quotes yet</p>
              <span>Your downloads will appear here</span>
            </div>
          ) : (
            <div className="downloads-grid">
              {downloads.map((img, index) => (
                <div key={index} className="download-item">
                  <img src={img} alt={`Quote ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="profile-footer">
        Made with ❤️ by <span>Suvichar</span>
      </p>
    </div>
  );
};

export default Profile;
