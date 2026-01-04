import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const purpose = localStorage.getItem("purpose");
  const userName = localStorage.getItem("userName");
  const businessName = localStorage.getItem("businessName");
  const userImage = localStorage.getItem("userImage");
  const phone = localStorage.getItem("phone"); // 🔥 FIXED

  const displayName = purpose === "BUSINESS" ? businessName : userName;

  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    const savedDownloads = JSON.parse(localStorage.getItem("downloads")) || [];
    setDownloads(savedDownloads);
  }, []);

  return (
    <div className="screen profile-screen">
      <h2>Profile</h2>

      <div className="profile-card">
        <img
          src={userImage || "/default-profile.png"}
          alt="profile"
          className="profile-image"
        />

        <h3>{displayName || "Your Name"}</h3>

        <p>{phone || "+91 XXXXXXXX"}</p>

        <button className="edit-profile-btn" onClick={() => navigate("/edit")}>
          EDIT PROFILE
        </button>
      </div>

      <div className="downloads">
        <h4>Downloaded Quotes</h4>

        <div className="quotes-grid">
          {downloads.length === 0 ? (
            <div className="empty-state">No downloaded quotes yet</div>
          ) : (
            downloads.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="quote"
                className="downloaded-quote"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
