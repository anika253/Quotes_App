import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileSetup.css";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const purpose = localStorage.getItem("purpose"); // PERSONAL | BUSINESS

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  const isPersonal = purpose === "PERSONAL";

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    setImage(imageURL);

    localStorage.setItem(isPersonal ? "userImage" : "businessImage", imageURL);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    localStorage.setItem(isPersonal ? "userName" : "businessName", name.trim());

    navigate("/home");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-icon">{isPersonal ? "👤" : "🏢"}</div>

        <h2 className="profile-title">Set up your profile</h2>
        <p className="profile-subtitle">
          {isPersonal
            ? "Add your photo and name"
            : "Add your logo and business name"}
        </p>

        {/* Image Upload */}
        <div className="image-upload">
          {image && (
            <img
              src={image}
              alt="preview"
              className={isPersonal ? "avatar" : "logo"}
            />
          )}

          <label className="upload-btn">
            Upload {isPersonal ? "Photo" : "Logo"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* Name Input */}
        <input
          className="profile-input"
          type="text"
          placeholder={isPersonal ? "Enter your name" : "Enter business name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Actions */}
        <button
          className="primary-btn"
          disabled={!name.trim()}
          onClick={handleSave}
        >
          Save & Continue
        </button>

        <button className="secondary-btn" onClick={() => navigate("/home")}>
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;
