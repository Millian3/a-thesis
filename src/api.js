// ---------------- Teacher / RFID ----------------
export async function checkRfid(uid) {
  try {
    // Normalize UID on frontend as well
    const normalizedUid = String(uid).replace(/\D/g, "").trim();

    const res = await fetch(`http://localhost:5000/api/check-rfid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: normalizedUid }),
    });

    return await res.json();
  } catch (err) {
    console.error("checkRfid error:", err);
    return { role: null };
  }
}

export async function logKeyEvent(user, key, action) {
  try {
    const res = await fetch(`http://localhost:5000/api/key-event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacherName: user, keyNumber: key, action }),
    });
    return await res.json();
  } catch (err) {
    console.error("logKeyEvent error:", err);
    return { success: false };
  }
}

// ---------------- Admin / Excel Pilot ----------------
export async function getKeys() {
  try {
    const res = await fetch("http://localhost:5000/api/keys");
    return await res.json(); // [{ keyNumber, status }]
  } catch (err) {
    console.error("getKeys error:", err);
    return [];
  }
}

export async function getLogs() {
  try {
    const res = await fetch("http://localhost:5000/api/logs");
    return await res.json(); // [{ teacherName, keyNumber, action, timestamp }]
  } catch (err) {
    console.error("getLogs error:", err);
    return [];
  }
}

export async function exportLogs() {
  try {
    const res = await fetch("http://localhost:5000/api/logs/export");
    const blob = await res.blob();
    return blob; // User can download as Excel/CSV
  } catch (err) {
    console.error("exportLogs error:", err);
    return null;
  }
}

export async function takeKey(keyNumber, adminUser) {
  try {
    const res = await fetch("http://localhost:5000/api/key/take", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyNumber, adminUser }),
    });
    return await res.json();
  } catch (err) {
    console.error("takeKey error:", err);
    return { success: false };
  }
}

export async function returnKey(keyNumber, adminUser) {
  try {
    const res = await fetch("http://localhost:5000/api/key/return", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyNumber, adminUser }),
    });
    return await res.json();
  } catch (err) {
    console.error("returnKey error:", err);
    return { success: false };
  }
}
