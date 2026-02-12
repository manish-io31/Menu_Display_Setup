import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import MenuCard from "../../components/MenuCard/MenuCard";
import PageHeader from "../../components/PageHeader/PageHeader";
import Modal from "../../components/Modal/Modal";
import { createDisplayRequest } from "../../redux/actions";
import { RootState, AppDispatch } from "../../redux/store";

import "./FinalPreview.css";

const FinalPreview: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme);
  const menu = useSelector((state: RootState) => state.menu);
  const saving = useSelector((state: RootState) => state.saving);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 40; // padding
        const containerHeight = containerRef.current.clientHeight - 40;
        const targetWidth = 1280;
        const targetHeight = 720;

        const scaleX = containerWidth / targetWidth;
        const scaleY = containerHeight / targetHeight;
        const scale = Math.min(scaleX, scaleY, 1); // Max scale 1

        containerRef.current.style.setProperty(
          "--preview-scale",
          scale.toString(),
        );
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleCreate = () => {
    if (!displayName.trim()) {
      alert("Please enter a display name");
      return;
    }

    const selectedItems = menu.flatMap((cat) =>
      cat.items.filter((item) => item.isSelected),
    );

    dispatch(
      createDisplayRequest({
        name: displayName,
        type: "Digital Signage",
        orientation: theme.orientation as "landscape" | "portrait",
        isActive: true,
        selectedItems: selectedItems,
        theme: theme,
        uploadedImages: (theme.menuImages || []).filter((img) => !!img),
      }),
    );

    setShowCreateModal(false);
  };

  return (
    <div className="final-preview-page">
      <PageHeader title="Display signage" currentStep={5} showBackBtn={false} />

      <main className="final-preview-content" ref={containerRef}>
        <MenuCard
          theme={theme}
          isFullPreview={false}
          previewMode={true}
          hideHeader={true}
        />
      </main>

      <footer className="final-footer">
        <button
          className="btn-cancel-outline"
          onClick={() => navigate("/upload-images")}
          disabled={saving}
        >
          CANCEL
        </button>
        <button
          className="btn-create-filled"
          onClick={() => setShowCreateModal(true)}
          disabled={saving}
        >
          {saving ? "CREATING..." : "CREATE"}
        </button>
      </footer>

      {showCreateModal && (
        <Modal
          title="Create New Display"
          onClose={() => setShowCreateModal(false)}
        >
          <div className="create-display-form">
            <p>Enter a name for your menu display signage.</p>
            <input
              type="text"
              className="modal-input"
              placeholder="Display Name (e.g., Main Entrance)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button
                className="btn-modal-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                CANCEL
              </button>
              <button className="btn-modal-primary" onClick={handleCreate}>
                CREATE
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FinalPreview;
