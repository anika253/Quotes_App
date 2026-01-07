import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Check,
  X,
  Share2,
  Download,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import { api } from "../api";
import "./Upgrade.css";

const Upgrade = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = storedUser.name || "Your Brand Name";

  const showToast = (message) => {
    toast({
      title: message,
      duration: 2500,
    });
  };

  const handleSubscribe = async () => {
    try {
      const amount = selectedPlan === "monthly" ? 199 : 999;
      
      showToast("Initiating payment...");
      
      const response = await api.initiatePayment({
        plan: selectedPlan,
        amount: amount
      });

      const paymentData = response.data;

      if (paymentData.paymentId) {
        showToast(`Payment initiated! ID: ${paymentData.paymentId}`);
        // Mocking a successful payment after 2 seconds
        setTimeout(async () => {
          try {
            const verifyRes = await api.verifyPayment(paymentData.paymentId);
            if (verifyRes.data.status === 'completed') {
              showToast("Payment successful! You are now a Premium member.");
              // Update local user data
              const updatedUser = { ...storedUser, subscriptionStatus: 'pro' };
              localStorage.setItem("user", JSON.stringify(updatedUser));
              navigate("/home");
            }
          } catch (err) {
            showToast("Verification failed.");
          }
        }, 2000);
      }
    } catch (error) {
      showToast("Payment failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="upgrade-container">
      {/* Header */}
      <header className="upgrade-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1>Upgrade to Premium</h1>
      </header>

      <main className="upgrade-main">
        {/* Preview */}
        <div className="preview-card">
          <div className="preview-icon">
            <Crown />
          </div>
          <h3>{displayName}</h3>
          <p className="preview-sub">
            <Sparkles /> Premium Branding Preview
          </p>
        </div>

        {/* Plans */}
        <div className="plans">
          <button
            className={`plan ${selectedPlan === "monthly" ? "active" : ""}`}
            onClick={() => setSelectedPlan("monthly")}
          >
            <h4>Monthly</h4>
            <p className="price">₹199</p>
            <span>per month</span>
          </button>

          <button
            className={`plan ${selectedPlan === "yearly" ? "active" : ""}`}
            onClick={() => setSelectedPlan("yearly")}
          >
            <span className="badge">BEST VALUE</span>
            <h4>Yearly</h4>
            <p className="price">₹999</p>
            <span>₹83 / month</span>
          </button>
        </div>

        {/* Subscribe */}
        <button
          className="subscribe-btn"
          onClick={handleSubscribe}
        >
          <Crown /> Subscribe Now
        </button>

        {/* Premium Features */}
        <div className="features-card">
          <h4>
            <Sparkles /> Premium Features
          </h4>
          <ul>
            <li>
              <Check /> Custom name & logo branding
            </li>
            <li>
              <Check /> Contact & organization details
            </li>
            <li>
              <Check /> Unlimited quote templates
            </li>
            <li>
              <Check /> Priority support
            </li>
          </ul>
        </div>

        {/* Free Info */}
        <div className="free-card">
          <h4>Free Version Limitations</h4>
          <ul>
            <li>
              <X /> No name/logo branding
            </li>
            <li>
              <X /> Contact & org details locked
            </li>
            <li>
              <X /> Limited quote templates
            </li>
          </ul>

          <div className="free-actions">
            <button onClick={() => showToast("Free share (no branding)")}>
              <Share2 /> Share
            </button>
            <button onClick={() => showToast("Free download (no branding)")}>
              <Download /> Download
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upgrade;
