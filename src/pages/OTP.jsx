import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OTP = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = () => {
    if (otp.length === 6) {
      navigate("/purpose");
    } else {
      alert("Enter 6-digit OTP");
    }
  };

  const resendOTP = () => {
    setTimer(30);
    alert("OTP resent (mock)");
  };

  return (
    <div className="screen">
      <h2>OTP Verification </h2>
      <p>OTP Sent +91 {phone}</p>

      <input
        type="number"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={handleVerify}>Verify OTP</button>

      <p>
        {timer > 0 ? (
          <>Resend OTP in {timer}s</>
        ) : (
          <span
            onClick={resendOTP}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Resend OTP
          </span>
        )}
      </p>
    </div>
  );
};

export default OTP;
