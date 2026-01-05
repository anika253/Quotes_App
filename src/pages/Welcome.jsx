import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone } from "lucide-react";
import "./Welcome.css";

const Welcome = () => {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (phone.length === 10) {
      localStorage.setItem("phone", `+91 ${phone}`);
      navigate("/otp", { state: { phone } });
    } else {
      alert("Enter valid 10-digit number");
    }
  };

  const isValidPhone = phone.length === 10;

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-icon">
          <Smartphone />
        </div>

        <h1 className="welcome-title">Welcome 🙏</h1>
        <p className="welcome-subtitle">
          Register your phone number to continue
        </p>

        <label className="phone-label">Phone Number</label>
        <div className="phone-input-wrapper">
          <span className="country-code">+91</span>
          <input
            type="tel"
            placeholder="9876543210"
            value={phone}
            maxLength={10}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        {phone.length > 0 && phone.length < 10 && (
          <p className="error-text">Please enter a valid 10-digit number</p>
        )}

        <button
          className="continue-btn"
          onClick={handleContinue}
          disabled={!isValidPhone}
        >
          Continue
        </button>

        <p className="terms-text">
          By continuing, you agree to our <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>
        </p>
      </div>

      <p className="welcome-footer">
        Need help? <a href="#">Contact Support</a>
      </p>
    </div>
  );
};

export default Welcome;
