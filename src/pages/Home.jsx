import { useState } from "react";
import { useNavigate } from "react-router-dom";
import quotes from "../data/quotes.js";
import "./Home.css";

const categories = [
  "Good Morning",
  "Motivational",
  "Shayari",
  "Religious",
  "Love",
  "Festival",
];

const Home = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const purpose = localStorage.getItem("purpose");
  const userName =
    purpose === "BUSINESS"
      ? localStorage.getItem("businessName")
      : localStorage.getItem("userName");

  const userImage = localStorage.getItem("userImage");

  const quote = quotes[current];

  const nextQuote = () => {
    setCurrent((prev) => (prev + 1) % quotes.length);
  };

  return (
    <div className="screen">
      {/* Top Bar */}
      <div className="top-bar">
        <h3>Suvichar</h3>
        <span className="profile-icon" onClick={() => navigate("/profile")}>
          👤
        </span>
      </div>

      {/* Categories */}
      <div className="categories">
        {categories.map((cat) => (
          <span key={cat} className="category-pill">
            {cat}
          </span>
        ))}
      </div>

      {/* Quote Card */}
      <div className="quote-wrapper">
        <img src={quote.image} alt="quote" className="quote-image" />

        {/* Date Badge */}
        <div className="date-badge">17 November</div>

        {/* User Photo / Logo */}
        {userImage && <img src={userImage} alt="user" className="user-image" />}

        {/* User Name */}
        {userName && <div className="user-name">{userName}</div>}
      </div>

      {/* Next Button */}
      <button className="next-btn" onClick={nextQuote}>
        Next
      </button>

      {/* Actions */}
      <div className="actions">
        <button onClick={() => alert("Share coming soon")}>Share</button>
        <button onClick={() => alert("Download coming soon")}>Download</button>
        <button onClick={() => navigate("/edit")}>EDIT</button>
      </div>
    </div>
  );
};

export default Home;
