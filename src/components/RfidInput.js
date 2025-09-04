// components/RfidInput.js
import React, { useEffect, useState } from "react";
import './RfidInput.css';

export default function RfidInput({ onResult }) {
  const [uid, setUid] = useState("");       // Live UID display
  const [message, setMessage] = useState("Waiting for RFID scan...");

  useEffect(() => {
    let buffer = "";

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        const scannedUid = buffer.trim();
        if (scannedUid) {
          setUid(scannedUid);            // Show final UID in input
          setMessage("Scan received! Processing...");
          onResult(scannedUid);          // Send UID to parent
        }
        buffer = "";
        // Reset input for next scan
        setTimeout(() => {
          setUid("");
          setMessage("Waiting for RFID scan...");
        }, 1500);
      } else if (e.key.length === 1) {    // Only printable characters
        buffer += e.key;
        setUid(buffer);                    // Live update as scanner types
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [onResult]);

  return (
    <div className="rfid-input" style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>{message}</h2>
      <input
        type="text"
        value={uid}
        readOnly
        autoFocus
        placeholder="Scan your RFID card..."
        style={{
          fontSize: "1.4rem",
          padding: "0.5rem 1rem",
          width: "300px",
          textAlign: "center",
        }}
      />
      <p>Please tap your card on the RFID Reader.</p>
    </div>
  );
}
