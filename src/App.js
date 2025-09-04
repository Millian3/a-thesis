import React, { useState } from "react";
import RfidInput from "./components/RfidInput";
import TeacherPopup from "./components/TeacherPopup";
import AdminPanel from "./components/AdminPanel";
import * as api from "./api";
import './App.css';

export default function App() {
  const [mode, setMode] = useState("start");
  const [context, setContext] = useState(null);
  const [keyStatus, setKeyStatus] = useState({});

  const handleRfid = async (uid) => {
    try {
      const normalizedUid = String(uid).replace(/[\r\n]/g, "").trim();
      console.log("Frontend sending UID:", JSON.stringify(normalizedUid));
      const r = await api.checkRfid(normalizedUid);
      console.log("RFID response:", r);

      if (r.role === "teacher") {
        if (!r.key) {
          alert(`${r.user} has no assigned key.`);
          return;
        }

        const keyId = r.key.id;
        const action = keyStatus[keyId] === "taken" ? "returned" : "taken";

        setContext({ uid: normalizedUid, user: r.user, key: r.key, action });
        setMode("teacher");

        setKeyStatus((prev) => ({ ...prev, [keyId]: action }));

        await api.logKeyEvent(r.user, keyId, action);

        // Auto-close TeacherPopup after 4 seconds
        setTimeout(() => {
          setMode("start");
          setContext(null);
        }, 4000);

      } else if (r.role === "admin") {
        setContext({ uid: normalizedUid, user: r.user });
        setMode("admin");
      } else {
        alert("Unknown UID — not found in system.");
      }
    } catch (err) {
      console.error("Error checking RFID:", err);
    }
  };

  return (
    <div className="app">
       <header className="topbar"><h2>STI eKMS</h2></header>

      <main>
        {mode === "start" && <RfidInput onResult={handleRfid} />}
        {mode === "teacher" && context && context.key && (
          <TeacherPopup
            user={context.user}
            keyData={context.key}
            action={context.action}
            onClose={() => {
              setMode("start");
              setContext(null);
            }}
          />
        )}
        {mode === "admin" && context && (
          <AdminPanel adminUser={context.user} onBack={() => setMode("start")} />
        )}
      </main>
    </div>
  );
}
