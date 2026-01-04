import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const purpose = localStorage.getItem("purpose"); // PERSONAL or BUSINESS

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
      localStorage.setItem("userImage", imageURL);
    }
  };

  const handleSave = () => {
    if (purpose === "PERSONAL") {
      localStorage.setItem("userName", name);
    } else {
      localStorage.setItem("businessName", name);
    }
    navigate("/home");
  };

  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div className="screen">
      <h2>Set up your profile</h2>

      {purpose === "PERSONAL" && (
        <>
          <p>Add your photo and name</p>

          <input type="file" accept="image/*" onChange={handleImageUpload} />

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </>
      )}

      {purpose === "BUSINESS" && (
        <>
          <p>Add your logo and business name</p>

          <input type="file" accept="image/*" onChange={handleImageUpload} />

          <input
            type="text"
            placeholder="Enter business name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </>
      )}

      <div style={{ marginTop: 24 }}>
        <button onClick={handleSave}>Save & Continue</button>
        <button onClick={handleSkip} style={{ marginLeft: 12 }}>
          Skip
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;
