import { useNavigate } from "react-router-dom";

const PurposeSelection = () => {
  const navigate = useNavigate();

  const handleSelect = (purpose) => {
    localStorage.setItem("purpose", purpose);

    navigate("/profile-setup");
  };

  return (
    <div className="screen">
      <h2>How will you use this app?</h2>
      <p>Select one option</p>

      <div className="purpose-container">
        <div className="purpose-card" onClick={() => handleSelect("PERSONAL")}>
          <h3>PERSONAL</h3>
          <p>Create quotes with your name and photo</p>
        </div>

        <div className="purpose-card" onClick={() => handleSelect("BUSINESS")}>
          <h3>BUSINESS</h3>
          <p>Create branded quotes with your logo and business name</p>
        </div>
      </div>
    </div>
  );
};

export default PurposeSelection;
