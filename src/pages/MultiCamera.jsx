import React from "react";
import LiveCamera from "./LiveCamera";

function MultiCamera() {
  const locations = [
    "Puerto",
    "Cugman",
    "Bukidnon",
    "Lapasan"
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px"
    }}>
      {locations.map((loc, index) => (
        <LiveCamera key={index} label={loc} />
      ))}
    </div>
  );
}

export default MultiCamera;