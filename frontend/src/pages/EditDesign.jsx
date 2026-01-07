import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Camera } from "lucide-react";
import "./EditDesign.css";

const EditDesign = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const savedPurpose = localStorage.getItem("purpose") || "PERSONAL";
  const [activeTab, setActiveTab] = useState(savedPurpose);

  const [name, setName] = useState(
    activeTab === "BUSINESS"
      ? localStorage.getItem("businessName") || ""
      : localStorage.getItem("userName") || ""
  );

  const [image, setImage] = useState(localStorage.getItem("userImage") || null);

  const [showDate, setShowDate] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    if (activeTab === "BUSINESS") {
      localStorage.setItem("businessName", name);
    } else {
      localStorage.setItem("userName", name);
    }

    if (image) {
      localStorage.setItem("userImage", image);
    }

    navigate("/");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setName(
      tab === "BUSINESS"
        ? localStorage.getItem("businessName") || ""
        : localStorage.getItem("userName") || ""
    );
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
            onClick={() => setShowDate(!showDate)}
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
        <button className="save-btn" onClick={handleSave}>
          Save & Continue
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
