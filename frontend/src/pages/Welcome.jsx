import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { api } from "../api";
import "./Welcome.css";

const Welcome = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isLogin) {
        response = await api.login(email, password);
      } else {
        response = await api.signup(email, password);
      }

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/purpose");
      }
    } catch (error) {
      console.error("Auth error:", error);
      const errorMessage = error.response?.data?.message || 
        (isLogin ? "Login failed. Please try again." : "Signup failed. Please try again.");
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isValid = validateEmail(email) && password.length >= 6;

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-icon">
          <Mail />
        </div>

        <h1 className="welcome-title">Welcome 🙏</h1>
        <p className="welcome-subtitle">
          {isLogin ? "Sign in to your account" : "Create your account"}
        </p>

        <form onSubmit={handleSubmit}>
          <label className="phone-label">Email Address</label>
          <div className="phone-input-wrapper">
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {email.length > 0 && !validateEmail(email) && (
            <p className="error-text">Please enter a valid email address</p>
          )}

          <label className="phone-label" style={{ marginTop: "16px" }}>Password</label>
          <div className="phone-input-wrapper">
            <Lock className="input-icon" size={20} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {password.length > 0 && password.length < 6 && (
            <p className="error-text">Password must be at least 6 characters</p>
          )}

          <button
            type="submit"
            className="continue-btn"
            disabled={!isValid || loading}
          >
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <p className="terms-text" style={{ marginTop: "16px" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              setIsLogin(!isLogin);
              setEmail("");
              setPassword("");
            }}
            style={{ color: "#007bff", cursor: "pointer" }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </a>
        </p>

        <p className="terms-text" style={{ marginTop: "8px", fontSize: "12px" }}>
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
