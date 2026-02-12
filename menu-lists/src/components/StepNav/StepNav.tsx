import { useNavigate } from "react-router-dom";
import "./StepNav.css";

interface StepNavProps {
  currentStep: number;
  setCurrentStep?: (step: number) => void;
}

function StepNav({ currentStep, setCurrentStep }: StepNavProps) {
  const navigate = useNavigate();

  const steps = [
    { label: "Display Setup", path: "/display-setup" },
    { label: "Theme", path: "/preview" },
    { label: "Item Mapping", path: "/item-mapping" },
    { label: "Upload Images", path: "/upload-images" },
  ];

  const handleStepClick = (stepNumber: number, path: string) => {
    setCurrentStep?.(stepNumber);
    navigate(path);
  };

  return (
    <div className="step-nav-wrapper">
      <div className="step-nav">
        {steps.map((step, index) => {
          const stepNumber = index + 1;

          return (
            <div className="step-item" key={step.label}>
              <div
                className={`step-circle
                  ${stepNumber < currentStep ? "done" : ""}
                  ${stepNumber === currentStep ? "active" : ""}
                `}
                onClick={() => handleStepClick(stepNumber, step.path)}
              >
                {stepNumber}
              </div>

              <span
                className={`step-label ${
                  stepNumber === currentStep ? "active-label" : ""
                }`}
                onClick={() => handleStepClick(stepNumber, step.path)}
              >
                {step.label}
              </span>

              {index !== steps.length - 1 && <div className="step-line" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepNav;
