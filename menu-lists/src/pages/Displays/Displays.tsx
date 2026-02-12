import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDisplaysRequest,
  deleteDisplayRequest,
} from "../../redux/actions";
import { RootState, AppDispatch } from "../../redux/store";
import PageHeader from "../../components/PageHeader/PageHeader";
import Modal from "../../components/Modal/Modal";
import "./Displays.css";

const Displays: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { displays, fetchingDisplays, saving } = useSelector(
    (state: RootState) => state,
  );

  const [deleteId, setDeleteId] = useState<number | string | null>(null);

  useEffect(() => {
    dispatch(fetchDisplaysRequest());
  }, [dispatch]);

  const handleDelete = () => {
    if (deleteId !== null) {
      dispatch(deleteDisplayRequest(deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="displays-page">
      <PageHeader title="Managed Displays" showBackBtn={true} />

      <div className="displays-content">
        {fetchingDisplays ? (
          <div className="loading-state">Loading displays...</div>
        ) : displays.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📺</div>
            <h3>No displays found</h3>
            <p>
              Create your first menu display signage from the Preview screen.
            </p>
          </div>
        ) : (
          <div className="displays-grid">
            {displays.map((display) => (
              <div className="display-card" key={display.id}>
                <div className="display-card-header">
                  <div className="display-info">
                    <span className="display-title">{display.name}</span>
                    <span className="display-meta">
                      {display.orientation} • {display.type}
                    </span>
                  </div>
                  <div className="display-status">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={display.isActive}
                        readOnly
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="display-card-footer">
                  <button className="btn-icon" title="Edit">
                    ✏️
                  </button>
                  <button
                    className="btn-icon delete"
                    title="Delete"
                    onClick={() => setDeleteId(display.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteId !== null && (
        <Modal
          title="Delete Display Confirmation"
          onClose={() => setDeleteId(null)}
        >
          <div className="delete-modal-content">
            <p>
              Are you sure you want to delete this display? This action cannot
              be undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn-modal-secondary"
                onClick={() => setDeleteId(null)}
              >
                CANCEL
              </button>
              <button className="btn-modal-danger" onClick={handleDelete}>
                {saving ? "DELETING..." : "CONFIRM DELETE"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Displays;
