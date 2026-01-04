import { useState } from "react";
import "./Upgrade.css";

const Upgrade = () => {
  const [toast, setToast] = useState("");

  // Read data from localStorage
  const purpose = localStorage.getItem("purpose"); // PERSONAL or BUSINESS
  const userName = localStorage.getItem("userName");
  const businessName = localStorage.getItem("businessName");

  // Decide what name to show
  const displayName = purpose === "BUSINESS" ? businessName : userName;

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="screen upgrade-screen">
      <h2>Upgrade to Premium</h2>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* Premium Preview */}
      <div className="premium-preview">
        <div className="preview-avatar">👑</div>
        <h3>{displayName || "Your Brand Name"}</h3>
        <p>Premium Branding Preview</p>
      </div>

      {/* Plan Cards */}
      <div className="plans">
        <div
          className="plan-card"
          onClick={() => showToast("Payment flow coming soon")}
        >
          <h4>Monthly</h4>
          <p className="price">₹199 / month</p>
        </div>

        <div
          className="plan-card highlighted"
          onClick={() => showToast("Payment flow coming soon")}
        >
          <h4>Yearly</h4>
          <p className="price">₹999 / year</p>
          <span className="subtext">₹83/month equivalent</span>
        </div>
      </div>

      {/* Free Version Section */}
      <div className="free-version">
        <h4>Free Version</h4>
        <ul>
          <li>❌ No name/logo branding</li>
          <li>❌ Contact & organization details locked</li>
          <li>❌ Limited quote templates</li>
        </ul>
      </div>

      {/* Free Actions */}
      <div className="free-actions">
        <button
          onClick={() => showToast("Free version share (without branding)")}
        >
          Share
        </button>
        <button
          onClick={() => showToast("Free version download (without branding)")}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default Upgrade;
