import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Camera } from "lucide-react";
import { api } from "../api";
import "./EditDesign.css";

const EditDesign = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const savedPurpose = localStorage.getItem("purpose") || "PERSONAL";
  const [activeTab, setActiveTab] = useState(savedPurpose);
  const [loading, setLoading] = useState(false);

  // Get name from backend user data first, then fallback to localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [name, setName] = useState(
    storedUser?.name || 
    (activeTab === "BUSINESS"
      ? localStorage.getItem("businessName") || ""
      : localStorage.getItem("userName") || "")
  );

  const [image, setImage] = useState(localStorage.getItem("userImage") || null);

  const [showDate, setShowDate] = useState(
    localStorage.getItem("showDate") !== "false"
  );
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Load user data from backend (MongoDB) on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await api.getProfile();
        if (response.data?.user) {
          const user = response.data.user;
          // Set name from MongoDB
          if (user.name) {
            setName(user.name);
          }
          // Set image from MongoDB
          if (user.userImage) {
            setImage(user.userImage);
          }
          // Set showDate from MongoDB
          if (user.showDate !== undefined) {
            setShowDate(user.showDate);
          }
          // Update localStorage as cache
          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (error) {
        console.warn("Could not load user profile from backend:", error);
        // Fallback to localStorage cache
        const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (cachedUser.name) setName(cachedUser.name);
        if (cachedUser.userImage) setImage(cachedUser.userImage);
      }
    };
    loadUserData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert to base64 to store in MongoDB
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter a name");
      return;
    }

    setLoading(true);
    try {
      // Get purpose from stored user or localStorage
      const purpose = storedUser?.purpose || localStorage.getItem("purpose")?.toLowerCase() || "personal";

      // Update profile in MongoDB (backend)
      const response = await api.setupProfile({
        name: name.trim(),
        email: storedUser?.email || "",
        purpose: purpose,
        userImage: image || null, // Save base64 image to MongoDB
        showDate: showDate
      });

      if (response.data?.user) {
        // Update localStorage cache with backend response
        localStorage.setItem("user", JSON.stringify(response.data.user));
        alert("Profile saved successfully!");
        navigate("/home");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert(error.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Name comes from MongoDB user data, not localStorage
    // Keep current name when switching tabs
  };

  return (
    <div className="container">
      <div className="card">
        {/* Profile */}
        <div
          className="profile-wrapper"
          onClick={() => fileInputRef.current.click()}
        >
          {image ? (
            <img src={image} alt="Profile" className="profile-img" />
          ) : (
            <User size={40} />
          )}
          <div className="camera-overlay">
            <Camera size={20} />
          </div>
        </div>

        <h2>Edit Design</h2>
        <p className="subtitle">Customize your profile settings</p>

        {/* Tabs */}
        <div className="tabs">
          {["PERSONAL", "BUSINESS"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "tab active" : "tab"}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Input */}
        <label>
          {activeTab === "BUSINESS" ? "Business Name" : "Your Name"}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Upload */}
        <button
          className="upload-btn"
          onClick={() => fileInputRef.current.click()}
        >
          Upload Photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          hidden
        />

        {/* Toggle */}
        <div className="toggle-row">
          <span>Show Date</span>
          <button
            className={showDate ? "toggle on" : "toggle"}
            onClick={() => {
              setShowDate(!showDate);
              // Will be saved to backend when user clicks Save
            }}
          >
            <span />
          </button>
        </div>

        {/* Locked fields */}
        {["About Yourself", "Contact Details", "Organization Details"].map(
          (item) => (
            <div
              key={item}
              className="locked"
              onClick={() => setShowUpgrade(true)}
            >
              <Lock size={16} />
              <span>{item}</span>
            </div>
          )
        )}

        {/* Actions */}
        <button className="save-btn" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save & Continue"}
        </button>

        <button className="skip-btn" onClick={() => navigate("/")}>
          Skip for now
        </button>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Upgrade to Premium</h3>
            <p>This feature is available for premium users only.</p>
            <button onClick={() => navigate("/upgrade")}>View Plans</button>
            <button onClick={() => setShowUpgrade(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDesign;
