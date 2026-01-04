import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (phone.length === 10) {
      navigate("/otp", { state: { phone } });
    } else {
      alert("Enter valid 10-digit number");
    }
  };

  return (
    <div className="screen">
      <h2>WELCOME 🙏</h2>
      <p>Register your Phone number </p>

      <div style={{ display: "flex", gap: 8 }}>
        <span style={{ padding: "10px", background: "#eee" }}>+91</span>
        <input
          type="tel"
          placeholder="9876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <button onClick={handleContinue}>Continue</button>
    </div>
  );
};

export default Welcome;
