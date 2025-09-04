import React, { useState, useEffect } from "react";
import KeysPage from "./KeysPage";
import LogsPage from "./LogsPage";
import "./AdminPanel.css";

export default function AdminPanel({ adminUser, onBack }) {
  const [view, setView] = useState("home");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fake delay to show loader (like your old 3s)
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="key-loader">
          <div className="key-head"></div>
          <div className="key-shaft"></div>
        </div>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (view === "keys") {
    return <KeysPage adminUser={adminUser} onBack={() => setView("home")} />;
  }

  if (view === "logs") {
    return <LogsPage onBack={() => setView("home")} />;
  }

  return (
    <div className="admin-panel card">
      <div className="admin-top">
        <button className="btn pill" onClick={onBack}>
          ⬅ Back
        </button>
        <button className="btn pill" onClick={() => setView("keys")}>
          🔑 Manage Keys
        </button>
        <button className="btn pill ghost" onClick={() => setView("logs")}>
          📋 View Logs
        </button>
      </div>

      <div className="admin-home-message">
        <h2>Welcome, {adminUser?.user || "Admin"}!</h2>
        <p>Select an option above to manage Keys or view Logs.</p>
      </div>
    </div>
  );
}
