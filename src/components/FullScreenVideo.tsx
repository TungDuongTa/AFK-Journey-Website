import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

interface FullScreenVideoProps {
  isPlaying: boolean;
  onEnded: () => void;
}

// Number of main crack rays shooting from center
const NUM_RAYS = 8;
// Sub-segments per ray (makes them jagged)
const SEGMENTS_PER_RAY = 6;

interface CrackData {
  // SVG path strings for the visible crack lines
  crackPaths: string[];
  // clipPath polygons for the shards (pie-slice-like wedges)
  shardClips: string[];
}

function generateCracks(): CrackData {
  const cx = 0.5;
  const cy = 0.5;

  // Generate rays at roughly even angles with some randomness
  const baseAngleStep = (Math.PI * 2) / NUM_RAYS;
  const rays: { x: number; y: number }[][] = [];

  for (let i = 0; i < NUM_RAYS; i++) {
    const angle = baseAngleStep * i + (Math.random() - 0.5) * baseAngleStep * 0.4;
    const ray: { x: number; y: number }[] = [{ x: cx, y: cy }];

    // Each ray extends from center to past the edge of the screen
    const rayLength = 0.85 + Math.random() * 0.3;

    for (let s = 1; s <= SEGMENTS_PER_RAY; s++) {
      const t = s / SEGMENTS_PER_RAY;
      const dist = rayLength * t;
      // Add perpendicular jitter that increases with distance
      const jitter = (Math.random() - 0.5) * 0.06 * t;
      const perpAngle = angle + Math.PI / 2;
      const px = cx + Math.cos(angle) * dist + Math.cos(perpAngle) * jitter;
      const py = cy + Math.sin(angle) * dist + Math.sin(perpAngle) * jitter;
      ray.push({ x: px, y: py });
    }
    rays.push(ray);
  }

  // Build SVG paths for crack lines
  const crackPaths = rays.map((ray) => {
    return ray
      .map((p, idx) => `${idx === 0 ? "M" : "L"} ${(p.x * 100).toFixed(2)} ${(p.y * 100).toFixed(2)}`)
      .join(" ");
  });

  // Add a few short branch cracks off the main rays
  for (let i = 0; i < NUM_RAYS; i++) {
    const ray = rays[i];
    // Branch from a mid-point of each ray
    const branchFrom = ray[Math.floor(SEGMENTS_PER_RAY * 0.4) + 1];
    if (!branchFrom) continue;

    const branchAngle = Math.atan2(branchFrom.y - cy, branchFrom.x - cx) +
      (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.5);
    const branchLen = 0.08 + Math.random() * 0.12;
    const branchEnd = {
      x: branchFrom.x + Math.cos(branchAngle) * branchLen,
      y: branchFrom.y + Math.sin(branchAngle) * branchLen,
    };
    const branchMid = {
      x: branchFrom.x + Math.cos(branchAngle) * branchLen * 0.5 + (Math.random() - 0.5) * 0.02,
      y: branchFrom.y + Math.sin(branchAngle) * branchLen * 0.5 + (Math.random() - 0.5) * 0.02,
    };
    crackPaths.push(
      `M ${(branchFrom.x * 100).toFixed(2)} ${(branchFrom.y * 100).toFixed(2)} ` +
      `L ${(branchMid.x * 100).toFixed(2)} ${(branchMid.y * 100).toFixed(2)} ` +
      `L ${(branchEnd.x * 100).toFixed(2)} ${(branchEnd.y * 100).toFixed(2)}`
    );
  }

  // Build shard clips — each shard is a wedge between two adjacent rays
  // We use the ray endpoints to form polygon shapes
  const shardClips: string[] = [];
  for (let i = 0; i < NUM_RAYS; i++) {
    const rayA = rays[i];
    const rayB = rays[(i + 1) % NUM_RAYS];

    // Build polygon: center -> rayA points -> edge corners -> rayB points reversed -> center
    const polyPoints: string[] = [];

    // Center
    polyPoints.push(`${cx * 100}% ${cy * 100}%`);

    // Walk along ray A outward
    for (let s = 1; s < rayA.length; s++) {
      polyPoints.push(`${(rayA[s].x * 100).toFixed(2)}% ${(rayA[s].y * 100).toFixed(2)}%`);
    }

    // Find which screen edges this wedge touches and add corner points
    const endA = rayA[rayA.length - 1];
    const endB = rayB[rayB.length - 1];
    const cornersInWedge = getCornersBetween(endA, endB, cx, cy);
    for (const corner of cornersInWedge) {
      polyPoints.push(`${corner.x * 100}% ${corner.y * 100}%`);
    }

    // Walk along ray B back toward center
    for (let s = rayB.length - 1; s >= 1; s--) {
      polyPoints.push(`${(rayB[s].x * 100).toFixed(2)}% ${(rayB[s].y * 100).toFixed(2)}%`);
    }

    shardClips.push(`polygon(${polyPoints.join(", ")})`);
  }

  return { crackPaths, shardClips };
}

// Get screen corners (0,0  1,0  1,1  0,1) that fall between the angles of two ray endpoints
function getCornersBetween(
  endA: { x: number; y: number },
  endB: { x: number; y: number },
  cx: number,
  cy: number
): { x: number; y: number }[] {
  const corners = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ];

  const angleA = Math.atan2(endA.y - cy, endA.x - cx);
  let angleB = Math.atan2(endB.y - cy, endB.x - cx);

  // Normalize so angleB > angleA (going counterclockwise)
  if (angleB <= angleA) angleB += Math.PI * 2;

  return corners.filter((c) => {
    let ca = Math.atan2(c.y - cy, c.x - cx);
    if (ca <= angleA) ca += Math.PI * 2;
    return ca > angleA && ca < angleB;
  });
}

export default function FullScreenVideo({
  isPlaying,
  onEnded,
}: FullScreenVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<HTMLDivElement[]>([]);
  const crackSvgRef = useRef<SVGSVGElement | null>(null);
  const [mounted, setMounted] = useState(isPlaying);
  const [frameUrl, setFrameUrl] = useState<string | null>(null);
  const [crackData, setCrackData] = useState<CrackData | null>(null);
  const [phase, setPhase] = useState<"video" | "cracking" | "explode">("video");

  useEffect(() => {
    if (isPlaying) {
      setMounted(true);
      setFrameUrl(null);
      setCrackData(null);
      setPhase("video");
      tileRefs.current = [];
    }
  }, [isPlaying]);

  const handleVideoEnd = useCallback(() => {
    onEnded();

    const video = videoRef.current;
    if (!video) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const vr = video.videoWidth / video.videoHeight;
    const sr = W / H;
    let dw: number, dh: number, dx: number, dy: number;
    if (vr > sr) {
      dh = H; dw = H * vr; dx = (W - dw) / 2; dy = 0;
    } else {
      dw = W; dh = W / vr; dx = 0; dy = (H - dh) / 2;
    }
    ctx.drawImage(video, dx, dy, dw, dh);

    setCrackData(generateCracks());
    setFrameUrl(canvas.toDataURL());
    setPhase("cracking");
  }, [onEnded]);

  // Phase 2: Crack lines grow outward from center, shake, hold, then explode
  useEffect(() => {
    if (phase !== "cracking" || !crackSvgRef.current) return;

    const paths = crackSvgRef.current.querySelectorAll("path");
    if (paths.length === 0) return;

    const tl = gsap.timeline();

    // Set up stroke-dashoffset so each line starts invisible
    paths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    });

    // Main rays draw outward from center (first NUM_RAYS paths)
    const mainPaths = Array.from(paths).slice(0, NUM_RAYS);
    const branchPaths = Array.from(paths).slice(NUM_RAYS);

    // Main cracks grow out simultaneously
    tl.to(mainPaths, {
      strokeDashoffset: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.04,
    });

    // Branch cracks appear slightly after
    if (branchPaths.length > 0) {
      tl.to(branchPaths, {
        strokeDashoffset: 0,
        duration: 0.3,
        ease: "power1.out",
        stagger: 0.03,
      }, "-=0.2");
    }

    // Impact shake — use scale pulse instead of translate to avoid exposing edges
    if (containerRef.current) {
      tl.to(containerRef.current, {
        scale: 1.01,
        duration: 0.04,
        yoyo: true,
        repeat: 5,
        ease: "none",
      }, 0.15);
    }

    // Dramatic pause
    tl.to({}, { duration: 0.4 });

    tl.call(() => setPhase("explode"));
  }, [phase, crackData]);

  // Phase 3: Shards explode toward viewer
  useEffect(() => {
    if (phase !== "explode" || !frameUrl || !crackData) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    const raf = requestAnimationFrame(() => {
      const tl = gsap.timeline({ onComplete: () => setMounted(false) });

      tileRefs.current.forEach((el, i) => {
        if (!el) return;

        // Each shard is a wedge — compute its rough center angle for drift direction
        const angle = ((Math.PI * 2) / crackData.shardClips.length) * i;
        const driftX = Math.cos(angle) * (W * 0.12 + Math.random() * W * 0.08);
        const driftY = Math.sin(angle) * (H * 0.12 + Math.random() * H * 0.08);
        const rotate = (Math.random() - 0.5) * 35;
        const delay = Math.random() * 0.12;
        const duration = 0.45 + Math.random() * 0.2;

        tl.to(el, {
          x: driftX,
          y: driftY,
          rotation: rotate,
          scale: 3.5 + Math.random() * 2.5,
          opacity: 0,
          duration,
          ease: "power2.in",
        }, delay);
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [phase, frameUrl, crackData]);

  if (!mounted) return null;

  const W = typeof window !== "undefined" ? window.innerWidth : 1920;
  const H = typeof window !== "undefined" ? window.innerHeight : 1080;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ pointerEvents: phase === "explode" ? "none" : "auto" }}
    >
      {phase === "video" && (
        <video
          ref={videoRef}
          src="videos/loadingVideo.mp4"
          autoPlay
          muted
          onEnded={handleVideoEnd}
          className="absolute inset-0 w-full h-full object-cover"
          preload="auto"
        />
      )}

      {phase === "cracking" && frameUrl && (
        <>
          <img
            src={frameUrl}
            style={{ position: "absolute", top: 0, left: 0, width: W, height: H, display: "block" }}
          />
          <svg
            ref={crackSvgRef}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <defs>
              <filter id="crack-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="0.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Dark base layer — the depth of the crack */}
            {crackData?.crackPaths.map((d, i) => (
              <path
                key={`shadow-${i}`}
                d={d}
                fill="none"
                stroke="rgba(0,0,0,0.95)"
                strokeWidth="5"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {/* Mid layer — dark grey crack body */}
            {crackData?.crackPaths.map((d, i) => (
              <path
                key={`mid-${i}`}
                d={d}
                fill="none"
                stroke="rgba(30,30,30,0.9)"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {/* Top highlight — white edge catch like light hitting a crack */}
            {crackData?.crackPaths.map((d, i) => (
              <path
                key={`highlight-${i}`}
                d={d}
                fill="none"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#crack-glow)"
              />
            ))}
          </svg>
        </>
      )}

      {phase === "explode" && frameUrl && crackData &&
        crackData.shardClips.map((clip, i) => (
          <div
            key={i}
            ref={(el) => { if (el) tileRefs.current[i] = el; }}
            style={{ position: "absolute", inset: 0, clipPath: clip }}
          >
            <img
              src={frameUrl}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: W,
                height: H,
                display: "block",
              }}
            />
          </div>
        ))}
    </div>
  );
}
