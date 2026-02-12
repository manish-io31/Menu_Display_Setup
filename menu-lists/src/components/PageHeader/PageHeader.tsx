import React from "react";
import { useNavigate } from "react-router-dom";
import StepNav from "../StepNav/StepNav";
import "./PageHeader.css";

interface PageHeaderProps {
  title: string;
  currentStep?: number;
  showBackBtn?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  currentStep,
  showBackBtn = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="page-header-container">
      <div className="header-left">
        {showBackBtn && (
          <button className="header-back-btn" onClick={() => navigate(-1)}>
            <span className="back-icon">‹</span> Back
          </button>
        )}
        <h2 className="header-title">{title}</h2>
      </div>

      {currentStep !== undefined && (
        <div className="header-steps">
          <StepNav currentStep={currentStep} />
        </div>
      )}
    </div>
  );
};

export default PageHeader;
