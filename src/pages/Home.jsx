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
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const purpose = localStorage.getItem("purpose");
  const userName =
    purpose === "BUSINESS"
      ? localStorage.getItem("businessName")
      : localStorage.getItem("userName");

  const userImage = localStorage.getItem("userImage");
  const showDate = localStorage.getItem("showDate") !== "false";

  if (!quotes || quotes.length === 0) {
    return <div className="screen">No quotes available</div>;
  }

  const quote = quotes[current];

  const nextQuote = () => {
    setCurrent((prev) => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setCurrent((prev) => (prev === 0 ? quotes.length - 1 : prev - 1));
  };

  // WhatsApp Share
  const handleShare = () => {
    const message = encodeURIComponent(
      `"${quote.text}"\n\nCreated using Suvichar App\n${window.location.href}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  // Download + save to profile
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = quote.image;
    link.download = "suvichar.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const downloads = JSON.parse(localStorage.getItem("downloads")) || [];
    downloads.push(quote.image);
    localStorage.setItem("downloads", JSON.stringify(downloads));

    alert("Quote downloaded and saved to profile");
  };

  return (
    <div className="screen">
      {/* Top Bar */}
      <div className="top-bar">
        <h3>Suvichar</h3>

        <div className="profile-icon" onClick={() => navigate("/profile")}>
          <img
            src={userImage || "/default-profile.png"}
            alt="profile"
            className="top-profile-image"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="categories">
        {categories.map((cat) => (
          <span
            key={cat}
            className={`category-pill ${
              activeCategory === cat ? "active" : ""
            }`}
            onClick={() => {
              setActiveCategory(cat);
              setCurrent(0);
            }}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Quote Card */}
      <div className="quote-wrapper">
        <img src={quote.image} alt="quote" className="quote-image" />

        {showDate && <div className="date-badge">17 नवंबर</div>}

        {userImage && <img src={userImage} alt="user" className="user-image" />}

        {userName && <div className="user-name">{userName}</div>}
      </div>

      {/* Navigation */}
      <div className="nav-buttons">
        <button onClick={prevQuote}>Previous</button>
        <button onClick={nextQuote}>Next</button>
      </div>

      {/* Actions */}
      <div className="actions">
        <button onClick={handleShare}>Share</button>
        <button onClick={handleDownload}>Download</button>
        <button onClick={() => navigate("/edit")}>EDIT</button>
      </div>
    </div>
  );
};

export default Home;
