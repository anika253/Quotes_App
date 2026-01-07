import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { api } from "../api";
import "./OTP.css";

const OTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone || "XXXXXXXXXX";

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });

    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length === 6) {
      try {
        const response = await api.verifyOtp(phone, otpString);
        if (response.token) {
          localStorage.setItem("phoneNumber", phone);
          navigate("/purpose");
        } else {
          alert(response.message || "Invalid OTP");
        }
      } catch (error) {
        alert("Verification failed");
      }
    } else {
      alert("Enter 6-digit OTP");
    }
  };

  const resendOTP = async () => {
    try {
      await api.sendOtp(phone);
      setTimer(30);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      alert("OTP resent (mock: 123456)");
    } catch (error) {
      alert("Failed to resend OTP");
    }
  };

  const isValidOtp = otp.every((digit) => digit !== "");

  return (
    <div className="otp-container">
      <div className="otp-card">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>

        <div className="otp-icon">
          <ShieldCheck />
        </div>

        <h1 className="otp-title">OTP Verification</h1>
        <p className="otp-subtitle">Enter the code sent to</p>
        <p className="otp-phone">+91 {phone}</p>

        <div className="otp-input-container" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`otp-input-box ${digit ? "filled" : ""}`}
            />
          ))}
        </div>

        <button
          className="verify-btn"
          onClick={handleVerify}
          disabled={!isValidOtp}
        >
          Verify OTP
        </button>

        <p className="timer-text">
          {timer > 0 ? (
            <>
              Resend OTP in <span className="timer-count">{timer}s</span>
            </>
          ) : (
            <span className="resend-link" onClick={resendOTP}>
              Resend OTP
            </span>
          )}
        </p>
      </div>

      <p className="otp-footer">
        Need help? <a href="#">Contact Support</a>
      </p>
    </div>
  );
};

export default OTP;
