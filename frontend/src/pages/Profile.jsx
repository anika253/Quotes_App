import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User, Edit3, Download, ArrowLeft, Image, LogOut } from "lucide-react";
import { api } from "../api";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  
  // Get data from MongoDB user object
  const displayName = storedUser.name || "Your Name";
  const email = storedUser.email || "your.email@example.com";
  const userImage = storedUser.userImage || null;

  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const response = await api.getDownloadHistory();
        setDownloads(response.data);
      } catch (error) {
        console.error("Failed to fetch downloads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
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

          <h2>{displayName}</h2>
          <p className="phone">{email}</p>

          <div style={{ display: "flex", gap: "12px", flexDirection: "column", width: "100%" }}>
            <button className="edit-btn" onClick={() => navigate("/edit")}>
              <Edit3 /> Edit Profile
            </button>
            <button 
              className="edit-btn" 
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("userImage");
                navigate("/");
              }}
              style={{ background: "#ef4444", color: "white" }}
            >
              <LogOut /> Logout
            </button>
          </div>
        </div>

        {/* Downloads */}
        <div className="downloads-section">
          <div className="downloads-title">
            <Download />
            <h3>Downloaded Quotes</h3>
          </div>

          {loading ? (
            <p className="loading-text">Loading downloads...</p>
          ) : downloads.length === 0 ? (
            <div className="empty-downloads">
              <Image />
              <p>No downloaded quotes yet</p>
              <span>Your downloads will appear here</span>
            </div>
          ) : (
            <div className="downloads-grid">
              {downloads.map((item, index) => (
                <div key={index} className="download-item">
                  <img src={item.imageUrl} alt={`Quote ${index + 1}`} />
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
