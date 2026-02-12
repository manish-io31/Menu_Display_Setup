import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import ImageUploadCard from "../../components/ImageUploadCard/ImageUploadCard";
import { updateTheme, saveThemeRequest } from "../../redux/actions";
import { RootState, AppDispatch } from "../../redux/store";
import "./UploadImages.css";

const UploadImages: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme);
  const saving = useSelector((state: RootState) => state.saving);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isSubmitting && !saving) {
      navigate("/final-preview");
    }
  }, [saving, isSubmitting, navigate]);

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(theme.menuImages || ["", "", ""])];
    newImages[index] = value;
    dispatch(updateTheme({ menuImages: newImages }));
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...(theme.menuImages || ["", "", ""])];
    newImages[index] = "";
    dispatch(updateTheme({ menuImages: newImages }));
  };

  const handleContinue = () => {
    if (saving) return;
    setIsSubmitting(true);
    dispatch(saveThemeRequest(theme));
  };

  return (
    <div className="upload-images-container">
      <PageHeader title="Display signage" currentStep={4} />

      <div className="upload-images-content">
        <div className="images-status-bar">
          <div className="status-left">
            <span className="status-item">
              Selected Orientation:{" "}
              <b>
                {theme.orientation === "landscape"
                  ? "Landscape (3 Column Display)"
                  : "Portrait (Stacked Display)"}
              </b>
            </span>
            <span className="status-item">
              Font Size :{" "}
              <b>Large (Approx. {theme.approxItemsVisible} Items)</b>
            </span>
          </div>
          <div className="images-hint-box">
            Images will be shown based on available space only
          </div>
        </div>

        <div className="images-section-header">
          <h3>Images</h3>
          <span className="info-icon-small">i</span>
        </div>

        <div className="images-upload-grid">
          {(theme.menuImages || ["", "", ""]).map((img, idx) => (
            <ImageUploadCard
              key={idx}
              index={idx}
              value={img}
              onChange={(val) => handleImageChange(idx, val)}
              onRemove={() => handleRemoveImage(idx)}
            />
          ))}
        </div>
      </div>

      <footer className="upload-footer">
        <button className="btn-skip" onClick={handleContinue} disabled={saving}>
          {saving ? "SAVING..." : "SKIP"}
        </button>
        <button
          className="btn-back-outline"
          onClick={() => navigate(-1)}
          disabled={saving}
        >
          BACK
        </button>
        <button
          className="btn-continue-filled"
          onClick={handleContinue}
          disabled={saving}
        >
          {saving ? "SAVING..." : "CONTINUE"}
        </button>
      </footer>
    </div>
  );
};

export default UploadImages;
