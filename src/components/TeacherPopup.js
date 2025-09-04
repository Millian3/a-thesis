// components/TeacherPopup.js
import React, { useEffect } from "react";
import "./TeacherPopup.css";

export default function TeacherPopup({ user, keyData, action, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!keyData) return null;

  const timestamp = new Date().toLocaleString();

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h2>{user}</h2>
        <p>
          Key <strong>{keyData.id}</strong> has been{" "}
          <span className={action === "taken" ? "taken" : "returned"}>
            {action}
          </span>
          .
        </p>
        <p className="time">
          {action === "taken"
            ? `Start of class: ${timestamp}`
            : `End of class: ${timestamp}`}
        </p>
      </div>
    </div>
  );
}
