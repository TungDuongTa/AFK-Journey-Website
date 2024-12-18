import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const ParticleSystem: React.FC = () => {
  const particleContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  // Array of cloud image URLs
  const cloudImages = [
    "/img/cloud1.png",
    "/img/cloud2.png",
    "/img/cloud3.png",
    "/img/cloud4.png",
    "/img/cloud5.png",
    "/img/cloud6.png",
    "/img/cloud7.png",
    "/img/cloud8.png",
  ];

  const createParticle = () => {
    const container = particleContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    // Get the computed style of the container
    const style = window.getComputedStyle(container);
    const paddingTop = parseFloat(style.paddingTop);
    const paddingBottom = parseFloat(style.paddingBottom);

    // Calculate the available spawn height by subtracting padding from the total height
    const availableHeight = rect.height - paddingTop - paddingBottom;

    const spawnY = Math.random() * (availableHeight - 200); // Spawn between 200px and availableHeight - 200px
    const spawnX = -500;

    // Create the particle element
    const particle = document.createElement("img");
    particle.className = "absolute";
    particle.style.left = `${spawnX}px`; // Horizontal spawn
    particle.style.top = `${spawnY}px`; // Vertical spawn
    particle.style.pointerEvents = "none"; // Disable pointer events for the particle

    // Randomly select a cloud image
    const randomIndex = Math.floor(Math.random() * cloudImages.length);
    const randomImage = cloudImages[randomIndex];
    particle.src = randomImage;

    // Set width clamping styles based on the image
    const widthClampValues = [
      "clamp(234px, 24.4271vw, 469px)", // cloud1
      "clamp(166px, 17.3438vw, 333px)", // cloud2
      "clamp(208px, 21.7188vw, 417px)", // cloud3
      "clamp(168px, 17.5vw, 336px)", // cloud4
      "clamp(95px, 9.94792vw, 191px)", // cloud5
      "clamp(295px, 30.7292vw, 590px)", // cloud6
      "clamp(224px, 23.3333vw, 448px)", // cloud7
      "clamp(329px, 34.3229vw, 659px)", // cloud8
    ];
    particle.style.width = widthClampValues[randomIndex];

    // Append particle to container
    container.appendChild(particle);

    // Animate particle using GSAP
    gsap.to(particle, {
      x: rect.right + 1000, // Move slightly beyond the container's right edge
      duration: Math.random() * (22 - 18) + 18, // Random duration between 18s and 22s
      ease: "none",
      onComplete: () => {
        particle.remove(); // Clean up after animation
      },
    });
  };
  // Start generating particles
  const startParticles = () => {
    if (!intervalRef.current) {
      intervalRef.current = window.setInterval(createParticle, 3000); // Generate particles every 3 seconds
    }
  };

  // Stop generating particles
  const stopParticles = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    // Start particles on mount
    startParticles();

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopParticles(); // Pause when the page is unfocused
      } else {
        startParticles(); // Resume when the page is focused
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      stopParticles();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        left: "var(--size-55)",
        top: "var(--size-80)",
        right: "var(--size-120)",
        bottom: "var(--size-80)",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 2,
      }}
      className="relative"
    >
      <div
        ref={particleContainerRef}
        className="w-full h-full relative overflow-hidden"
      ></div>
    </div>
  );
};

export default ParticleSystem;
