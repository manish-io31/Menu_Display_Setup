import { useState, ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTheme } from "../../redux/actions";
import { useNavigate } from "react-router-dom";
import MenuCard from "../../components/MenuCard/MenuCard";
import PageHeader from "../../components/PageHeader/PageHeader";
import { ThemeConfig } from "../../types";
import { calculateCapacityStatistics } from "../../utils/capacityCalculator";
import { RootState, AppDispatch } from "../../redux/store";
import "./Preview.css";

export default function Preview() {
  const navigate = useNavigate();
  const [isFullPreview, setIsFullPreview] = useState(false);

  // Default sections visibility
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    branding: true,
    theme: true,
    orientation: true,
    fonts: true,
    colors: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const dispatch = useDispatch<AppDispatch>();
  const { menu = [], theme } = useSelector((state: RootState) => state);

  // Sync capacity when theme settings change (like in ItemMapping)
  useEffect(() => {
    const stats = calculateCapacityStatistics(theme, menu);
    if (stats.totalCapacity !== theme.approxItemsVisible) {
      dispatch(updateTheme({ approxItemsVisible: stats.totalCapacity }) as any);
    }
  }, [
    theme.fontSizeScale,
    theme.orientation,
    theme.showLogo,
    theme.showFooter,
    theme.showUnavailable,
    menu,
  ]);

  // Helper to update theme via Redux
  const handleThemeUpdate = (updates: Partial<ThemeConfig>) => {
    dispatch(updateTheme(updates) as any);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleThemeUpdate({ backgroundImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="preview-layout-container">
      {/* Top Navigation / Header */}
      <PageHeader title="Display signage" currentStep={2} />

      <div className={`preview-page ${isFullPreview ? "full-preview" : ""}`}>
        {/* LEFT SIDEBAR */}
        {!isFullPreview && (
          <aside className="sidebar">
            {/* Branding Section */}
            <div className="sidebar-control-group">
              <div
                className="sidebar-label"
                onClick={() => toggleSection("branding")}
              >
                <span>Branding</span>
                <span
                  className={`sidebar-expand-icon ${!openSections.branding ? "collapsed" : ""}`}
                >
                  ^
                </span>
              </div>
              <div
                className={`sidebar-content ${!openSections.branding ? "collapsed" : ""}`}
              >
                <div className="sidebar-row-compact">
                  <span>Logo</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={theme.showLogo}
                      onChange={(e) =>
                        handleThemeUpdate({ showLogo: e.target.checked })
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="sidebar-row-compact mt-medium">
                  <span>Show Unavailable Items</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={theme.showUnavailable !== false} // Default true if undefined
                      onChange={(e) =>
                        handleThemeUpdate({ showUnavailable: e.target.checked })
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Apply Theme Section */}
            <div className="sidebar-control-group">
              <div
                className="sidebar-label"
                onClick={() => toggleSection("theme")}
              >
                <span>Apply Theme</span>
                <span
                  className={`sidebar-expand-icon ${!openSections.theme ? "collapsed" : ""}`}
                >
                  ^
                </span>
              </div>

              <div
                className={`sidebar-content ${!openSections.theme ? "collapsed" : ""}`}
              >
                {/* Background Type */}
                <div className="sidebar-row-inline">
                  <span className="input-label">Background</span>
                  <label className="sidebar-radio-label">
                    <input
                      type="radio"
                      name="bgType"
                      checked={theme.backgroundType === "color"}
                      onChange={() =>
                        handleThemeUpdate({ backgroundType: "color" })
                      }
                    />
                    Color
                  </label>
                  <label className="sidebar-radio-label">
                    <input
                      type="radio"
                      name="bgType"
                      checked={theme.backgroundType === "image"}
                      onChange={() =>
                        handleThemeUpdate({ backgroundType: "image" })
                      }
                    />
                    Image
                  </label>
                </div>

                {theme.backgroundType === "image" && (
                  <>
                    <div className="sidebar-row-compact">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sidebar-input"
                      />
                    </div>

                    <div className="sidebar-block mt-medium">
                      <div className="sidebar-row-header">
                        <span className="input-label">Image Opacity</span>
                        <span className="opacity-value-display">
                          {theme.bgOpacity ?? 100}%
                        </span>
                      </div>
                      <div className="slider-container">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={theme.bgOpacity ?? 100}
                          style={
                            {
                              "--slider-percent": `${theme.bgOpacity ?? 100}%`,
                            } as any
                          }
                          onChange={(e) =>
                            handleThemeUpdate({
                              bgOpacity: parseInt(e.target.value),
                            })
                          }
                          className="font-size-slider dotted-slider"
                        />
                        <div className="opacity-labels">
                          <span className="slider-breaker">0%</span>
                          <span className="slider-breaker">25%</span>
                          <span className="slider-breaker">50%</span>
                          <span className="slider-breaker">75%</span>
                          <span className="slider-breaker">100%</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Orientation Control */}
            <div className="sidebar-control-group">
              <div
                className="sidebar-label"
                onClick={() => toggleSection("orientation")}
              >
                <span>Orientation</span>
                <span
                  className={`sidebar-expand-icon ${
                    !openSections.orientation ? "collapsed" : ""
                  }`}
                >
                  ^
                </span>
              </div>
              <div
                className={`sidebar-content ${
                  !openSections.orientation ? "collapsed" : ""
                }`}
              >
                <div className="orientation-pill-group">
                  <button
                    className={`orientation-pill ${theme.orientation === "landscape" ? "active" : ""}`}
                    onClick={() =>
                      handleThemeUpdate({ orientation: "landscape" })
                    }
                  >
                    Landscape
                  </button>
                  <button
                    className={`orientation-pill ${theme.orientation === "portrait" ? "active" : ""}`}
                    onClick={() =>
                      handleThemeUpdate({ orientation: "portrait" })
                    }
                  >
                    Portrait
                  </button>
                </div>
              </div>
            </div>

            <div className="sidebar-control-group">
              <div
                className="sidebar-label"
                onClick={() => toggleSection("fontSize")}
              >
                <span>Font Size & Capacity</span>
                <span
                  className={`sidebar-expand-icon ${
                    !openSections.fontSize ? "collapsed" : ""
                  }`}
                >
                  ^
                </span>
              </div>
              <div
                className={`sidebar-content ${
                  !openSections.fontSize ? "collapsed" : ""
                }`}
              >
                <div className="sidebar-block">
                  <div className="slider-container">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={theme.fontSizeScale || 3}
                      style={
                        {
                          "--slider-percent": `${(((theme.fontSizeScale || 3) - 1) / 9) * 100}%`,
                        } as any
                      }
                      onChange={(e) =>
                        handleThemeUpdate({
                          fontSizeScale: parseFloat(e.target.value),
                        })
                      }
                      className="font-size-slider dotted-slider"
                    />
                    <div className="slider-labels">
                      <span className="slider-breaker">1</span>
                      <span className="slider-breaker">2</span>
                      <span className="slider-breaker">3</span>
                      <span className="slider-breaker">4</span>
                      <span className="slider-breaker">5</span>
                      <span className="slider-breaker">6 </span>
                      <span className="slider-breaker">7</span>
                      <span className="slider-breaker">8</span>
                      <span className="slider-breaker">9</span>
                      <span className="slider-breaker">10</span>
                    </div>
                  </div>

                  <div className="capacity-indicator">
                    <span>Approx. Items Visible</span>
                    <span className="capacity-count">
                      {theme.approxItemsVisible}
                    </span>
                  </div>

                  <p className="capacity-note">
                    * Adjusting the font size automatically updates the number
                    of items that fit on a single screen.
                  </p>
                </div>
              </div>
            </div>

            {/* Scrolling & Layout Control */}
            <div className="sidebar-control-group">
              <div
                className="sidebar-label"
                onClick={() => toggleSection("scrolling")}
              >
                <span>Scrolling & Layout</span>
                <span
                  className={`sidebar-expand-icon ${!openSections.scrolling ? "collapsed" : ""}`}
                >
                  ^
                </span>
              </div>
              <div
                className={`sidebar-content ${!openSections.scrolling ? "collapsed" : ""}`}
              >
                <div className="sidebar-row-compact">
                  <span>Enable Board Scrolling</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={theme.allowScrolling}
                      onChange={(e) =>
                        handleThemeUpdate({ allowScrolling: e.target.checked })
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="sidebar-row-compact mt-medium">
                  <span>Show Nav Footer</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={theme.showFooter}
                      onChange={(e) =>
                        handleThemeUpdate({ showFooter: e.target.checked })
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <p className="capacity-note mt-small">
                  * Controls for the board scrolling and navigation bar
                  visibility.
                </p>
              </div>
            </div>

            {/* Fonts */}
            <div className="sidebar-control-group">
              <div
                className="sidebar-label"
                onClick={() => toggleSection("fonts")}
              >
                <span>Fonts</span>
                <span
                  className={`sidebar-expand-icon ${!openSections.fonts ? "collapsed" : ""}`}
                >
                  ^
                </span>
              </div>
              <div
                className={`sidebar-content ${!openSections.fonts ? "collapsed" : ""}`}
              >
                <label className="sidebar-block">
                  <span className="input-label">Category font</span>
                  <select
                    className="sidebar-select"
                    value={theme.categoryFont}
                    onChange={(e) =>
                      handleThemeUpdate({ categoryFont: e.target.value })
                    }
                  >
                    <option value="Protest Riot">Protest Riot</option>
                    <option value="Outfit">Raela Grotesque (Outfit)</option>
                    <option value="Roboto">Roboto</option>
                  </select>
                </label>

                <label className="sidebar-block">
                  <span className="input-label">Item font</span>
                  <select
                    className="sidebar-select"
                    value={theme.itemFont}
                    onChange={(e) =>
                      handleThemeUpdate({ itemFont: e.target.value })
                    }
                  >
                    <option value="Outfit">Raela Grotesque (Outfit)</option>
                    <option value="Protest Riot">Protest Riot</option>
                    <option value="Roboto">Roboto</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Colors */}
            <div className="sidebar-control-group">
              <div
                className="sidebar-label"
                onClick={() => toggleSection("colors")}
              >
                <span>Colors</span>
                <span
                  className={`sidebar-expand-icon ${!openSections.colors ? "collapsed" : ""}`}
                >
                  ^
                </span>
              </div>
              <div
                className={`sidebar-content ${!openSections.colors ? "collapsed" : ""}`}
              >
                <label className="sidebar-block">
                  <span className="input-label">Primary color</span>
                  <div className="color-input-wrapper">
                    <div
                      className="color-preview"
                      style={{ "--color-preview-bg": theme.primary } as any}
                    ></div>
                    <input
                      type="text"
                      value={theme.primary}
                      className="sidebar-input code-input"
                      readOnly
                    />
                    <input
                      type="color"
                      value={theme.primary}
                      onChange={(e) =>
                        handleThemeUpdate({ primary: e.target.value })
                      }
                      className="color-trigger"
                    />
                  </div>
                </label>

                <label className="sidebar-block">
                  <span className="input-label">Secondary color</span>
                  <div className="color-input-wrapper">
                    <div
                      className="color-preview"
                      style={{ "--color-preview-bg": theme.secondary } as any}
                    ></div>
                    <input
                      type="text"
                      value={theme.secondary}
                      className="sidebar-input code-input"
                      readOnly
                    />
                    <input
                      type="color"
                      value={theme.secondary}
                      onChange={(e) =>
                        handleThemeUpdate({ secondary: e.target.value })
                      }
                      className="color-trigger"
                    />
                  </div>
                </label>

                <label className="sidebar-block">
                  <span className="input-label">Background color</span>
                  <div className="color-input-wrapper">
                    <div
                      className="color-preview"
                      style={
                        { "--color-preview-bg": theme.backgroundColor } as any
                      }
                    ></div>
                    <input
                      type="text"
                      value={theme.backgroundColor}
                      className="sidebar-input code-input"
                      readOnly
                    />
                    <input
                      type="color"
                      value={theme.backgroundColor}
                      onChange={(e) =>
                        handleThemeUpdate({ backgroundColor: e.target.value })
                      }
                      className="color-trigger"
                    />
                  </div>
                </label>

                <label className="sidebar-block">
                  <span className="input-label">Category Font color</span>
                  <div className="color-input-wrapper">
                    <div
                      className="color-preview"
                      style={
                        { "--color-preview-bg": theme.categoryFontColor } as any
                      }
                    ></div>
                    <input
                      type="text"
                      value={theme.categoryFontColor}
                      className="sidebar-input code-input"
                      readOnly
                    />
                    <input
                      type="color"
                      value={theme.categoryFontColor}
                      onChange={(e) =>
                        handleThemeUpdate({
                          categoryFontColor: e.target.value,
                        })
                      }
                      className="color-trigger"
                    />
                  </div>
                </label>

                <label className="sidebar-block">
                  <span className="input-label">Item Font color</span>
                  <div className="color-input-wrapper">
                    <div
                      className="color-preview"
                      style={
                        { "--color-preview-bg": theme.itemFontColor } as any
                      }
                    ></div>
                    <input
                      type="text"
                      value={theme.itemFontColor}
                      className="sidebar-input code-input"
                      readOnly
                    />
                    <input
                      type="color"
                      value={theme.itemFontColor}
                      onChange={(e) =>
                        handleThemeUpdate({ itemFontColor: e.target.value })
                      }
                      className="color-trigger"
                    />
                  </div>
                </label>
              </div>
            </div>
          </aside>
        )}

        {/* MENU PREVIEW */}
        <main className="menu-preview">
          <MenuCard
            theme={theme}
            isFullPreview={isFullPreview}
            setIsFullPreview={setIsFullPreview}
            onItemsVisibleChange={(count) => {
              if (count !== theme.approxItemsVisible) {
                handleThemeUpdate({ approxItemsVisible: count });
              }
            }}
            previewMode={true}
          />
        </main>
      </div>

      {/* Footer / Actions */}
      {!isFullPreview && theme.showFooter && (
        <div className="footer-actions">
          <div className="info-text">
            <span className="info-icon">i</span>
            This preview is mainly for theme representation. The exact item
            mapping can be viewed in Display Only
          </div>
          <div className="action-buttons">
            <button className="btn-back">BACK</button>
            <button
              className="btn-continue"
              onClick={() => navigate("/item-mapping")}
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
