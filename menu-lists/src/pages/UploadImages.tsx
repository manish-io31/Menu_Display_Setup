import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateTheme } from "../redux/Authactions";
import { MenuState } from "../redux/Authreducer";
import MenuCard from "./menucard";
import StepNav from "../components/StepNav";
import "../App.css";

const UploadImages = () => {
  const dispatch = useDispatch() as any;
  const navigate = useNavigate();
  const { theme } = useSelector((state: MenuState) => state);
  const [activeTab, setActiveTab] = useState<"logo" | "background">("logo");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(updateTheme({ logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(
          updateTheme({
            backgroundType: "image",
            backgroundImage: reader.result as string,
          }),
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    dispatch(updateTheme({ logo: "" }));
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const handleRemoveBg = () => {
    dispatch(updateTheme({ backgroundImage: "", backgroundType: "color" }));
    if (bgInputRef.current) bgInputRef.current.value = "";
  };

  // Mock function for "Final Review" or next step
  const handleNext = () => {
    // navigate("/final-review"); // Future route
    alert("Proceeding to Final Review (Not implemented yet)");
  };

  return (
    <div className="preview-layout-container">
      <div className="page-header">
        <div className="header-left">
          <button className="header-back-btn" onClick={() => navigate(-1)}>
            <span className="sidebar-back-btn-content">‹</span> Back
          </button>
          <h1 className="header-title">Display signage</h1>
        </div>
        <StepNav currentStep={4} />
      </div>

      <div
        className="item-mapping-grid"
        style={{ gridTemplateColumns: "350px 1fr" }}
      >
        {/* LEFT PANEL: Controls */}
        <div className="sidebar-controls">
          <h2>Customize Branding</h2>

          <div className="control-group">
            <label>Active Section</label>
            <div className="toggle-group">
              <button
                className={`toggle-btn ${activeTab === "logo" ? "active" : ""}`}
                onClick={() => setActiveTab("logo")}
              >
                Logo
              </button>
              <button
                className={`toggle-btn ${activeTab === "background" ? "active" : ""}`}
                onClick={() => setActiveTab("background")}
              >
                Background
              </button>
            </div>
          </div>

          {activeTab === "logo" && (
            <div className="control-section fade-in">
              <h3>Logo Settings</h3>
              <div
                className="upload-box"
                onClick={() => logoInputRef.current?.click()}
              >
                {theme.logo ? (
                  <img
                    src={theme.logo}
                    alt="Logo Preview"
                    className="upload-preview"
                  />
                ) : (
                  <div className="upload-placeholder">
                    <span>Click to Upload Logo</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  hidden
                />
              </div>

              {theme.logo && (
                <>
                  <div className="control-group">
                    <button
                      className="btn-danger-outline"
                      onClick={handleRemoveLogo}
                    >
                      Remove Logo
                    </button>
                  </div>

                  <div className="control-group">
                    <label>Logo Size ({theme.logoWidth || 150}px)</label>
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={theme.logoWidth || 150}
                      onChange={(e) =>
                        dispatch(
                          updateTheme({ logoWidth: Number(e.target.value) }),
                        )
                      }
                    />
                  </div>

                  <div className="control-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={theme.showLogo}
                        onChange={(e) =>
                          dispatch(updateTheme({ showLogo: e.target.checked }))
                        }
                      />
                      Show Logo on Card
                    </label>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "background" && (
            <div className="control-section fade-in">
              <h3>Background Settings</h3>
              <div
                className="upload-box"
                onClick={() => bgInputRef.current?.click()}
              >
                {theme.backgroundImage ? (
                  <div
                    className="upload-preview-bg"
                    style={{ backgroundImage: `url(${theme.backgroundImage})` }}
                  />
                ) : (
                  <div className="upload-placeholder">
                    <span>Click to Upload Background</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={bgInputRef}
                  onChange={handleBgUpload}
                  accept="image/*"
                  hidden
                />
              </div>

              {theme.backgroundImage && (
                <>
                  <div className="control-group">
                    <button
                      className="btn-danger-outline"
                      onClick={handleRemoveBg}
                    >
                      Remove Background
                    </button>
                  </div>

                  <div className="control-group">
                    <label>Opacity ({theme.bgOpacity || 100}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={theme.bgOpacity || 100}
                      onChange={(e) =>
                        dispatch(
                          updateTheme({ bgOpacity: Number(e.target.value) }),
                        )
                      }
                    />
                  </div>
                </>
              )}
              <div className="control-group">
                <label>Background Color (Fallback)</label>
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) =>
                    dispatch(updateTheme({ backgroundColor: e.target.value }))
                  }
                />
              </div>
            </div>
          )}

          <div className="sidebar-footer">
            <button className="btn-continue" onClick={handleNext}>
              FINALIZE DESIGN -&gt;
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Preview */}
        <div className="preview-container">
          <div className="preview-wrapper">
            <MenuCard theme={theme} previewMode={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImages;
