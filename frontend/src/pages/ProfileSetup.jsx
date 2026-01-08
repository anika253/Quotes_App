import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import "./ProfileSetup.css";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const purpose = localStorage.getItem("purpose"); // PERSONAL | BUSINESS

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const isPersonal = purpose === "PERSONAL";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    setImage(imageURL);

    localStorage.setItem("userImage", imageURL);
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const response = await api.setupProfile({
        name: name.trim(),
        email: email.trim(),
        purpose: purpose.toLowerCase() // Convert to lowercase to match backend enum
      });

      // Axios response data is in response.data
      const responseData = response.data;

      if (responseData.user) {
        localStorage.setItem("user", JSON.stringify(responseData.user));
        navigate("/home");
      } else {
        alert(responseData.message || "Failed to save profile");
      }
    } catch (error) {
      console.error("Profile setup error:", error);
      const errorMessage = error.response?.data?.message || "Failed to save profile";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
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

        {/* Email Input */}
        <input
          className="profile-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginTop: '10px' }}
        />

        {/* Actions */}
        <button
          className="primary-btn"
          disabled={!name.trim() || loading}
          onClick={handleSave}
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>

        <button className="secondary-btn" onClick={() => navigate("/home")}>
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;
