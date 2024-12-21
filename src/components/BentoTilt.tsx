import { MouseEvent, ReactNode, useRef, useState } from "react";
interface BentoTiltProps {
  children: ReactNode;
  className?: string;
}
export default function BentoTilt({
  children,
  className = "",
}: BentoTiltProps) {
  const [transformStyle, setTransformStyle] = useState<string>("");
  const itemRef = useRef<HTMLDivElement | null>(null);
  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - left) / width;
    const relativeY = (e.clientY - top) / height;
    const tiltX = (relativeX - 0.5) * 5; // Tilt intensity can be adjusted
    const tiltY = (relativeY - 0.5) * -5;
    const newTransform = `perspective(700px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) `;
    setTransformStyle(newTransform);
  }
  function handleMouseLeave() {
    setTransformStyle("");
  }
  return (
    <div
      className={className}
      ref={itemRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: "transform 0.3s ease-out",
      }}
    >
      {children}
    </div>
  );
}
