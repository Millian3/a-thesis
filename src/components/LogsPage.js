// LogsPage.js
import React, { useEffect, useState } from "react";
import { getLogs, exportLogs } from "../api";
import "./AdminPanel.css";

export default function LogsPage({ onBack }) {
  const [logs, setLogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadLogs() {
    setBusy(true);
    try {
      const l = await getLogs();
      // ✅ Sort logs newest → oldest
      const sorted = [...l].sort(
        (a, b) => new Date(b.time_taken) - new Date(a.time_taken)
      );
      setLogs(sorted);
    } catch (err) {
      alert("Error loading logs: " + err.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      loadLogs();
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
        <h2>Loading Logs...</h2>
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
        <button className="btn pill ghost" onClick={loadLogs} disabled={busy}>
          🔄 Refresh
        </button>
      </div>

      <section>
        <h3>Logs</h3>
        {/* ✅ Export button centered */}
        <div style={{ textAlign: "center", margin: "1rem 0" }}>
          <button className="btn pill" onClick={exportLogs}>
            ⬇ Export Logs
          </button>
        </div>

        <table className="logs">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Room</th>
              <th>Taken</th>
              <th>Returned</th>
            </tr>
          </thead>
          <tbody>
            {logs.slice(0, visibleCount).map((l, idx) => (
              <tr key={l.id || idx}>
                <td>{idx + 1}</td>
                <td>{l.name}</td>
                <td>{l.key_number}</td>
                <td>
                  {l.time_taken && new Date(l.time_taken).toLocaleString()}
                </td>
                <td>
                  {l.time_returned
                    ? new Date(l.time_returned).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Load more button */}
        {visibleCount < logs.length && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              className="btn pill ghost"
              onClick={() => setVisibleCount((c) => c + 10)}
            >
              Load More
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
