import React, { useEffect, useState } from "react";
import { getKeys, takeKey, returnKey } from "../api";
import "./AdminPanel.css";

export default function KeysPage({ adminUser, onBack }) {
  const [keys, setKeys] = useState([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadKeys() {
    setBusy(true);
    try {
      const k = await getKeys();
      setKeys(k);
    } catch (err) {
      alert("Error loading keys: " + err.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      loadKeys();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="key-loader">
          <div className="key-head"></div>
          <div className="key-shaft"></div>
        </div>
        <h2>Loading Keys...</h2>
      </div>
    );
  }

  return (
    <div className="admin-panel card">
      <div
        className="admin-top"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <button className="btn pill" onClick={onBack}>
          ⬅ Back
        </button>
        <button className="btn pill ghost" onClick={loadKeys} disabled={busy}>
          🔄 Refresh
        </button>
      </div>

      <section>
        <h3>Keys</h3>
        <div className="keys-grid">
          {keys.map((k) => (
            <div key={k.id} className={`key-card ${k.status}`}>
              <div className="key-info">
                <h4>Room {k.key_number}</h4>
                <p>
                  Status:{" "}
                  <span className={`status-tag ${k.status}`}>
                    {k.status === "available"
                      ? "🟢 Available"
                      : "🔴 Taken"}
                  </span>
                </p>
              </div>
              <div className="key-actions">
                {k.status === "available" && (
                  <button
                    className="btn small"
                    onClick={async () => {
                      try {
                        await takeKey(adminUser.uid, k.key_number);
                        await loadKeys();
                      } catch (err) {
                        alert(err.message);
                      }
                    }}
                  >
                    Take
                  </button>
                )}
                {k.status === "taken" && (
                  <button
                    className="btn small ghost"
                    onClick={async () => {
                      try {
                        await returnKey(adminUser.uid, k.key_number);
                        await loadKeys();
                      } catch (err) {
                        alert(err.message);
                      }
                    }}
                  >
                    Force Return
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
