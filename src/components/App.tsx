import React, { useState } from "react";

const App = () => {
  const [coordinates, setCoordinates] = useState("");

  function getInternetSpeedCategory() {
    if ("connection" in navigator && navigator["connection"]) {
      const connection = navigator["connection"] as any; // Explicitly specify the type as 'any'
      const downlink = connection.downlink;
      let connectionSpeed = "";
      if (downlink <= 0 || !downlink) {
        connectionSpeed = "No Internet";
      } else if (downlink <= 10) {
        connectionSpeed = "Slow";
      } else if (downlink >= 10 && downlink <= 100) {
        connectionSpeed = "Medium";
      } else if (downlink >= 100) {
        connectionSpeed = "Fast";
      }
      setCoordinates(`${connectionSpeed} (${connection.effectiveType}) `);
      return `${connectionSpeed} (${connection.effectiveType}) `;
    }
  }

  return (
    <div>
      <img src="banner.png"></img>
      <h1 className="text-4xl text-green-500">{coordinates}</h1>

      <button className="btn" onClick={getInternetSpeedCategory}>
        click me{" "}
      </button>
    </div>
  );
};

export default App;
