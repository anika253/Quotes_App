import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const purpose = localStorage.getItem("purpose");
  const userName = localStorage.getItem("userName");
  const businessName = localStorage.getItem("businessName");
  const userImage = localStorage.getItem("userImage");
  const phone = localStorage.getItem("phone") || "+91 XXXXXXXXXX";

  const displayName = purpose === "BUSINESS" ? businessName : userName;

  return (
    <div className="screen profile-screen">
      <h2>Profile</h2>

      <div className="profile-card">
        {userImage ? (
          <img src={userImage} alt="profile" className="profile-image" />
        ) : (
          <div className="profile-placeholder">👤</div>
        )}

        <h3>{displayName || "Your Name"}</h3>
        <p>{phone}</p>

        <button className="edit-profile-btn" onClick={() => navigate("/edit")}>
          EDIT PROFILE
        </button>
      </div>

      <div className="downloads">
        <h4>Downloaded Quotes</h4>

        <div className="quotes-grid">
          <div className="empty-state">No downloaded quotes yet</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
