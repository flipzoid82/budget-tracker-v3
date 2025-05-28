// src/modals/ErrorModal.jsx
import React from "react";

const ErrorModal = ({ title = "Error", message, onClose }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div className="modal-overlay" onKeyDown={handleKeyDown}>
      <div className="modal modal-confirmation">
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-content confirmation-content">
          <div className="modal-warning-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="modal-confirmation-text">{message}</p>
        </div>

        {/* Footer */}
        <div className="modal-actions">
          <button className="btn btn-danger" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
