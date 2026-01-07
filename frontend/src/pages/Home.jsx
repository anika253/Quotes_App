import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Download,
  Edit3,
  User,
} from "lucide-react";
import quotes from "../data/quotes";
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
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const userName = userData?.name || "";
  const userImage = localStorage.getItem("userImage"); // Still using local for images for now as we don't have S3 upload yet
  const showDate = localStorage.getItem("showDate") !== "false";

  if (!quotes || quotes.length === 0) {
    return (
      <div className="empty-screen">
        <p>No quotes available</p>
      </div>
    );
  }

  const quote = quotes[current];

  const nextQuote = () => {
    setCurrent((prev) => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setCurrent((prev) => (prev === 0 ? quotes.length - 1 : prev - 1));
  };

  const handleShare = () => {
    const message = encodeURIComponent(
      `"${quote.text}"\n\nCreated using Suvichar App`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = quote.image;
    link.download = "suvichar.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const existing = JSON.parse(sessionStorage.getItem("downloads")) || [];

    if (!existing.includes(quote.image)) {
      existing.push(quote.image);
      sessionStorage.setItem("downloads", JSON.stringify(existing));
    }
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="top-bar">
        <h1 className="app-title">Suvichar</h1>

        <button className="profile-btn" onClick={() => navigate("/profile")}>
          {userImage ? (
            <img src={userImage} alt="Profile" />
          ) : (
            <User size={18} />
          )}
        </button>
      </header>

      {/* Categories */}
      <div className="categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={activeCategory === cat ? "category active" : "category"}
            onClick={() => {
              setActiveCategory(cat);
              setCurrent(0);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quote Card */}
      <main className="quote-area">
        <div className="quote-card">
          <img src={quote.image} alt="Quote" />

          {showDate && <div className="date-badge">17 नवंबर</div>}

          {userImage && (
            <img src={userImage} alt="User" className="user-avatar" />
          )}

          {userName && <div className="user-name">{userName}</div>}

          <button className="nav-btn left" onClick={prevQuote}>
            <ChevronLeft />
          </button>

          <button className="nav-btn right" onClick={nextQuote}>
            <ChevronRight />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="actions">
        <div className="action-row">
          <button onClick={handleShare}>
            <Share2 size={16} /> Share
          </button>

          <button onClick={handleDownload}>
            <Download size={16} /> Download
          </button>
        </div>

        <button className="edit-btn" onClick={() => navigate("/edit")}>
          <Edit3 size={16} /> EDIT DESIGN
        </button>
      </footer>
    </div>
  );
};

export default Home;
