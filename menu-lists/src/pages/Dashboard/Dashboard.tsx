import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG7_K4JPpUYrgBZuy2vZW-bGwTM_Oq-17xKw&s"
          alt="Salem RR Biriyani"
          className="company-logo"
        />
        <h1>SALEM RR BIRIYANI</h1>
        <button className="view-menu-btn" onClick={() => navigate("/menu")}>
          View Menu
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
