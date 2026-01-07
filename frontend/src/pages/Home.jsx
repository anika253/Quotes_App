import { useState, useEffect, useRef } from "react";
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
  const canvasRef = useRef(null);
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
  const userImage = localStorage.getItem("userImage");
  const showDate = localStorage.getItem("showDate") !== "false";
  const isPremium = userData?.subscriptionStatus === 'pro';

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

  const generateBrandedImage = () => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = quote.image;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        if (isPremium) {
          // Add branding
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

          ctx.fillStyle = "white";
          ctx.font = "bold 30px Arial";
          ctx.fillText(userName, 120, canvas.height - 40);

          if (userImage) {
            const profileImg = new Image();
            profileImg.crossOrigin = "anonymous";
            profileImg.src = userImage;
            profileImg.onload = () => {
              ctx.save();
              ctx.beginPath();
              ctx.arc(60, canvas.height - 50, 40, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(profileImg, 20, canvas.height - 90, 80, 80);
              ctx.restore();
              resolve(canvas.toDataURL("image/png"));
            };
            profileImg.onerror = () => resolve(canvas.toDataURL("image/png"));
          } else {
            resolve(canvas.toDataURL("image/png"));
          }
        } else {
          resolve(canvas.toDataURL("image/png"));
        }
      };
    });
  };

  const handleShare = async () => {
    const brandedImage = await generateBrandedImage();
    const message = encodeURIComponent(
      `"${quote.text}"\n\nCreated using Suvichar App`
    );
    // In a real mobile app, you'd share the image file. For web, we share the text.
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleDownload = async () => {
    const brandedImage = await generateBrandedImage();
    const link = document.createElement("a");
    link.href = brandedImage;
    link.download = `suvichar_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="home-container">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
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

          {isPremium && userImage && (
            <img src={userImage} alt="User" className="user-avatar" />
          )}

          {isPremium && userName && <div className="user-name">{userName}</div>}

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
