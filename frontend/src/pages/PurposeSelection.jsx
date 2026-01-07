import { useNavigate } from "react-router-dom";
import { User, Briefcase } from "lucide-react";
import "./PurposeSelection.css";

const PurposeSelection = () => {
  const navigate = useNavigate();

  const handleSelect = (purpose) => {
    localStorage.setItem("purpose", purpose);
    navigate("/profile-setup");
  };

  return (
    <div className="purpose-container">
      <div className="purpose-card">
        <div className="purpose-icon">
          <User />
        </div>

        <div className="purpose-header">
          <h2>How will you use this app?</h2>
          <p>Select one option to continue</p>
        </div>

        <div className="purpose-options">
          <button
            className="purpose-option"
            onClick={() => handleSelect("PERSONAL")}
          >
            <div className="option-icon">
              <User />
            </div>
            <div>
              <h3>Personal</h3>
              <p>Create quotes with your name and photo</p>
            </div>
          </button>

          <button
            className="purpose-option"
            onClick={() => handleSelect("BUSINESS")}
          >
            <div className="option-icon">
              <Briefcase />
            </div>
            <div>
              <h3>Business</h3>
              <p>Create branded quotes with your logo and business name</p>
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="purpose-footer">
        Need help? <span>Contact Support</span>
      </p>
    </div>
  );
};

export default PurposeSelection;
