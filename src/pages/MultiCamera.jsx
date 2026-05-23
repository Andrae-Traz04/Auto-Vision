import React from "react";
import LiveCamera from "./LiveCamera";

function MultiCamera({ updateDetections }) {
  const locations = ["Puerto", "Cugman", "Bukidnon", "Lapasan"];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      justifyItems: "center",   // ← centers each camera horizontally
      margin: "24px auto",      // ← centers the grid itself
      maxWidth: "1400px",       // ← prevents it from stretching too wide
    }}>
      {locations.map((loc, index) => (
        <LiveCamera
          key={index}
          label={loc}
          updateDetections={updateDetections}
        />
      ))}
    </div>
  );
}

export default MultiCamera;