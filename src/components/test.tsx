import { useState, useRef } from "react";

const MouseStopTracker = () => {
  const [isMouseStopped, setIsMouseStopped] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseMove = () => {
    // Clear any previous timeout if mouse is still moving
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set the state to false when the mouse is moving
    if (isMouseStopped) {
      setIsMouseStopped(false); // Mouse has started moving again
    }

    // Set a timeout to detect when the mouse stops
    timeoutRef.current = setTimeout(() => {
      setIsMouseStopped(true); // Mouse stopped
    }, 500); // 500ms delay to consider the mouse stopped
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ width: "100vw", height: "100vh", border: "1px solid black" }}
    >
      <h1>{isMouseStopped ? "Mouse Stopped" : "Mouse is Moving"}</h1>
    </div>
  );
};

export default MouseStopTracker;
