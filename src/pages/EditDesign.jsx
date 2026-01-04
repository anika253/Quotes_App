import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditDesign.css";

const EditDesign = () => {
  const navigate = useNavigate();

  const savedPurpose = localStorage.getItem("purpose") || "PERSONAL";
  const [activeTab, setActiveTab] = useState(savedPurpose);

  const [name, setName] = useState(
    activeTab === "BUSINESS"
      ? localStorage.getItem("businessName") || ""
      : localStorage.getItem("userName") || ""
  );

  const [image, setImage] = useState(localStorage.getItem("userImage"));
  const [showDate, setShowDate] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
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

    navigate("/home");
  };

  return (
    <div className="screen">
      <h2>Edit Design</h2>

      {/* Tabs */}
      <div className="tabs">
        {["PERSONAL", "BUSINESS"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "tab active" : "tab"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Editable Fields */}
      <div className="form">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Photo</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <div className="toggle">
          <input
            type="checkbox"
            checked={showDate}
            onChange={() => setShowDate(!showDate)}
          />
          <span>Show Date</span>
        </div>

        {/* Locked Fields */}
        <div className="locked" onClick={() => setShowUpgrade(true)}>
          🔒 About Yourself
        </div>
        <div className="locked" onClick={() => setShowUpgrade(true)}>
          🔒 Contact Details
        </div>
        <div className="locked" onClick={() => setShowUpgrade(true)}>
          🔒 Organization Details
        </div>

        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Upgrade to Premium</h3>
            <p>This feature is available for premium users.</p>
            <button onClick={() => navigate("/upgrade")}>View Plans</button>
            <button onClick={() => setShowUpgrade(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDesign;
