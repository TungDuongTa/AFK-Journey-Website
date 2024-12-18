import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const RotatingVideoPlane: React.FC = () => {
  const planeRef = useRef<THREE.Mesh>(null);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(
    null
  );
  const interactionTime = useRef<number>(0); // Tracks the interaction time
  const lastMouseMoveRef = useRef<number>(0); // Tracks the timestamp of the last mouse move
  const isHovering = useRef(false); // Tracks if the mouse is hovering over the plane
  const decreaseIntervalRef = useRef<number | undefined>(undefined); // Tracks the interval for decreasing time

  useEffect(() => {
    // Load video texture
    const videoElement = document.createElement("video");
    videoElement.src = "/videos/afk-hero-1.mp4"; // Replace with the path to your video
    videoElement.crossOrigin = "anonymous";
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.playsInline = true; // Prevents autoplay issues on mobile
    videoElement.onloadeddata = () => {
      videoElement.play();
      const texture = new THREE.VideoTexture(videoElement);
      setVideoTexture(texture);
    };
  }, []);

  const handleMouseMove = (event: MouseEvent) => {
    const now = Date.now();
    lastMouseMoveRef.current = now;

    // Stop decreasing interaction time if the mouse starts moving
    if (decreaseIntervalRef.current !== undefined) {
      clearInterval(decreaseIntervalRef.current);
      decreaseIntervalRef.current = undefined;
    }

    if (!isHovering.current) {
      // Increase interaction time up to a max limit (3 seconds)
      interactionTime.current = Math.min(3, interactionTime.current + 0.02);

      // Log interaction time
      console.log("Interaction Time (Increase):", interactionTime.current);

      // Update scale based on interaction time
      if (planeRef.current) {
        const scale = THREE.MathUtils.lerp(0, 16, interactionTime.current / 3); // Normalize for 3 seconds
        gsap.to(planeRef.current.scale, {
          x: scale,
          y: (9 / 16) * scale, // Maintain 16:9 aspect ratio
          z: 1,
          duration: 0.1,
          ease: "power2.out",
        });
      }
    }

    // Rotate the plane based on mouse position
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (planeRef.current) {
      gsap.to(planeRef.current.rotation, {
        x: y * 0.4,
        y: x * 0.4,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const startDecreasingInteractionTime = () => {
    if (decreaseIntervalRef.current !== undefined || isHovering.current) return; // Prevent overlapping intervals

    decreaseIntervalRef.current = window.setInterval(() => {
      if (interactionTime.current > 0) {
        interactionTime.current = Math.max(0, interactionTime.current - 0.1); // Decrease interaction time

        // Log interaction time
        console.log("Interaction Time (Decrease):", interactionTime.current);

        if (planeRef.current) {
          const scale = THREE.MathUtils.lerp(
            0,
            16,
            interactionTime.current / 3
          ); // Normalize for 3 seconds
          gsap.to(planeRef.current.scale, {
            x: scale,
            y: (9 / 16) * scale,
            z: 1,
            duration: 0.2,
            ease: "power2.out",
          });
        }
      } else {
        // Stop decreasing when time reaches 0
        if (decreaseIntervalRef.current !== undefined) {
          clearInterval(decreaseIntervalRef.current);
          decreaseIntervalRef.current = undefined;
        }
      }
    }, 50); // Smooth updates every 50ms
  };
  const handlePointerOver = () => {
    isHovering.current = true; // Track hover state
    if (planeRef.current) {
      gsap.to(planeRef.current.scale, {
        x: 16,
        y: 9,
        z: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handlePointerOut = () => {
    isHovering.current = false; // Reset hover state
    startDecreasingInteractionTime(); // Start decreasing interaction time
  };

  useEffect(() => {
    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove);

    // Check idle state every 100ms
    const idleCheckInterval = window.setInterval(() => {
      if (!isHovering.current && Date.now() - lastMouseMoveRef.current > 300) {
        startDecreasingInteractionTime(); // Start decreasing if idle for more than 100ms
      }
    }, 100);

    return () => {
      // Cleanup event listeners and intervals
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(idleCheckInterval);
      if (decreaseIntervalRef.current !== null) {
        clearInterval(decreaseIntervalRef.current);
      }
    };
  }, []);

  return (
    <mesh
      ref={planeRef}
      scale={[0, 0, 0]}
      position={[0, 0, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <planeGeometry args={[1, 1]} />
      {videoTexture && <meshStandardMaterial map={videoTexture} />}
    </mesh>
  );
};

const Test: React.FC = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 75,
        }}
        style={{ width: "80vw", height: "80vh" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} />
        <RotatingVideoPlane />
      </Canvas>
    </div>
  );
};

export default Test;
