import { useEffect, useState } from "react";

export function useMouseTilt(ref: React.RefObject<HTMLDivElement>) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const offsetX = event.clientX - rect.left; // Mouse X relative to element
        const offsetY = event.clientY - rect.top; // Mouse Y relative to element

        const xPercent = (offsetX / rect.width - 0.5) * 2; // Range: -1 to 1
        const yPercent = (offsetY / rect.height - 0.5) * 2; // Range: -1 to 1

        setTilt({ x: xPercent, y: yPercent });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [ref]);

  return tilt;
}
