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
import { api } from "../api";
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
    const loadUserData = async () => {
      try {
        // Get fresh data from backend (MongoDB)
        const response = await api.checkAuth();
        if (response.data?.user) {
          setUserData(response.data.user);
          // Update localStorage as cache only
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
      } catch (error) {
        console.error("Failed to load user data from backend:", error);
        // Fallback to localStorage cache if backend fails
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }
      }
    };
    loadUserData();
  }, []);

  // Get all data from userData (MongoDB) - this is the source of truth
  const userName = userData?.name || "";
  const userImage = userData?.userImage || null;
  const showDate = userData?.showDate !== false;
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
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        reject(new Error("Canvas not available"));
        return;
      }

      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = quote.image;

      img.onerror = () => {
        reject(new Error("Failed to load quote image"));
      };

      img.onload = () => {
        try {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Add branding only for premium users
          if (isPremium && (userName || userImage)) {
            const brandingHeight = 120;
            const padding = 20;

            // Draw semi-transparent background for branding
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.fillRect(0, canvas.height - brandingHeight, canvas.width, brandingHeight);

            let xOffset = padding;

            // Draw profile image if available
            if (userImage) {
              const profileImg = new Image();
              profileImg.crossOrigin = "anonymous";
              
              profileImg.onerror = () => {
                // If image fails to load, just draw name
                drawName();
              };

              profileImg.onerror = () => {
                // If image fails to load, just draw name
                drawName();
              };

              profileImg.onload = () => {
                // Draw circular profile image
                const radius = 35;
                const yPos = canvas.height - brandingHeight / 2;
                
                ctx.save();
                ctx.beginPath();
                ctx.arc(padding + radius, yPos, radius, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(profileImg, padding, yPos - radius, radius * 2, radius * 2);
                ctx.restore();

                // Draw name next to image
                xOffset = padding + radius * 2 + 20;
                drawName();
              };

              // Try to load image (works for both URLs and base64)
              profileImg.src = userImage;
            } else {
              drawName();
            }

            function drawName() {
              if (userName) {
                ctx.fillStyle = "white";
                ctx.font = "bold 32px Arial";
                ctx.textBaseline = "middle";
                ctx.fillText(userName, xOffset, canvas.height - brandingHeight / 2);
              }
              // Always resolve even if no name (for free users)
              resolve(canvas.toDataURL("image/png"));
            }

            // If no name or image for premium user, still resolve
            if (!userImage && !userName) {
              resolve(canvas.toDataURL("image/png"));
            }
          } else {
            // Free user - no branding
            resolve(canvas.toDataURL("image/png"));
          }
        } catch (error) {
          console.error("Error generating branded image:", error);
          reject(error);
        }
      };
    });
  };

  const handleShare = async () => {
    try {
      const brandedImage = await generateBrandedImage();
      const message = encodeURIComponent(
        `"${quote.text || 'Beautiful Quote'}"\n\n${isPremium && userName ? `Created by ${userName} using ` : ''}Suvichar App`
      );
      
      // Convert base64 to blob for sharing
      const blob = await fetch(brandedImage).then(res => res.blob());
      const file = new File([blob], 'quote.png', { type: 'image/png' });
      
      // Try to use Web Share API if available
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Beautiful Quote',
          text: quote.text || 'Check out this quote!',
          files: [file]
        });
      } else {
        // Fallback to WhatsApp web share
        window.open(`https://wa.me/?text=${message}`, "_blank");
      }
    } catch (error) {
      console.error("Share failed:", error);
      const message = encodeURIComponent(
        `"${quote.text || 'Beautiful Quote'}"\n\nCreated using Suvichar App`
      );
      window.open(`https://wa.me/?text=${message}`, "_blank");
    }
  };

  const handleDownload = async () => {
    try {
      // Generate branded image (will include name/photo for premium users)
      const brandedImage = await generateBrandedImage();
      
      // Save to MongoDB database
      try {
        await api.saveDownload({
          imageUrl: brandedImage, // Save the branded image
          quoteId: quote.id || current.toString(),
          category: activeCategory
        });
      } catch (dbError) {
        console.warn("Could not save to database:", dbError);
        // Continue with download even if DB save fails
      }

      // Download the branded image
      const link = document.createElement("a");
      link.href = brandedImage;
      const fileName = isPremium && userName 
        ? `suvichar_${userName.replace(/\s+/g, '_')}_${Date.now()}.png`
        : `suvichar_${Date.now()}.png`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      if (isPremium) {
        console.log("Downloaded with branding:", userName, userImage ? "with photo" : "");
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download. Please try again.");
    }
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
