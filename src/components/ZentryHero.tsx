import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

const VIDEOS = [
  "videos/hero-cut-1.mp4",
  "videos/hero-cut-2.mp4",
  "videos/hero-cut-3.mp4",
  "videos/hero-cut-4.mp4",
];

const POSTERS = [
  "https://a.storyblok.com/f/271652/1920x1080/4284d02fff/hero-cut-1-poster.png/m/",
  "https://a.storyblok.com/f/271652/1920x1080/5df11f77d7/hero-cut-2-poster.png/m/",
  "https://a.storyblok.com/f/271652/1920x1080/4e77e5b462/hero-cut-3-poster.png/m/",
  "https://a.storyblok.com/f/271652/1920x1080/566cabc2ff/hero-cut-4-poster.png/m/",
];

const R = 8;
const PORTAL_R = 18;

function pointAlong(
  from: { x: number; y: number },
  to: { x: number; y: number },
  distance: number,
): { x: number; y: number } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len === 0) return { ...from };
  const t = Math.max(0, Math.min(1, distance / len));
  return { x: from.x + dx * t, y: from.y + dy * t };
}

function makeRoundedQuadPath(
  tl: { x: number; y: number },
  tr: { x: number; y: number },
  br: { x: number; y: number },
  bl: { x: number; y: number },
  r: number,
): string {
  const maxR =
    Math.min(
      Math.hypot(tr.x - tl.x, tr.y - tl.y),
      Math.hypot(br.x - tr.x, br.y - tr.y),
      Math.hypot(bl.x - br.x, bl.y - br.y),
      Math.hypot(tl.x - bl.x, tl.y - bl.y),
    ) / 2;
  const radius = Math.min(r, maxR);

  const start = pointAlong(tl, tr, radius);
  const corners = [
    { corner: tr, prev: tl, next: br },
    { corner: br, prev: tr, next: bl },
    { corner: bl, prev: br, next: tl },
    { corner: tl, prev: bl, next: tr },
  ];

  let path = `M ${start.x} ${start.y}`;
  for (const { corner, prev, next } of corners) {
    const edgeIn = pointAlong(corner, prev, radius);
    const edgeOut = pointAlong(corner, next, radius);
    path += ` L ${edgeIn.x} ${edgeIn.y}`;
    path += ` Q ${corner.x} ${corner.y} ${edgeOut.x} ${edgeOut.y}`;
  }
  return `${path} Z`;
}

function makeRoundedRectPath(
  tl: { x: number; y: number },
  tr: { x: number; y: number },
  br: { x: number; y: number },
  bl: { x: number; y: number },
  r: number,
): string {
  return [
    `M ${tr.x - r} ${tl.y}`,
    `L ${tr.x - r} ${tr.y}`,
    `Q ${tr.x} ${tr.y} ${tr.x} ${tr.y + r}`,
    `L ${br.x} ${br.y - r}`,
    `Q ${br.x} ${br.y} ${br.x - r} ${br.y}`,
    `L ${bl.x + r} ${bl.y}`,
    `Q ${bl.x} ${bl.y} ${bl.x} ${bl.y - r}`,
    `L ${tl.x} ${tl.y + r}`,
    `Q ${tl.x} ${tl.y} ${tl.x + r} ${tl.y}`,
    "Z",
  ].join(" ");
}

function fullPath(w: number, h: number): string {
  const pad = 3;
  return makeRoundedRectPath(
    { x: -pad, y: -pad },
    { x: w + pad, y: -pad },
    { x: w + pad, y: h + pad },
    { x: -pad, y: h + pad },
    R,
  );
}

// Portal base size (at rest, no hover scale)
const HALF_W = 110;
const HALF_H = 110;
// Portal size when mouse is moving (scale applied on top)
const HOVER_SCALE = 1.35;

// miniPath: perspective quad by moving 4 corners independently.
// nx/ny = normalized -1..1 mouse offset from hero center.
function miniPathCorners(
  w: number,
  h: number,
  ox = 0,
  oy = 0,
  nx = 0,
  ny = 0,
  scale = 1,
): [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }, { x: number; y: number }] {
  const cx = w / 2 + ox;
  const cy = h / 2 + oy;
  const hw = HALF_W * scale;
  const hh = HALF_H * scale;

  const clampedNx = Math.max(-1, Math.min(1, nx));
  const clampedNy = Math.max(-1, Math.min(1, ny));

  const WIDTH_T = 0.32;
  const EDGE_T = 0.25;

  const corners = [
    { sx: -1, sy: -1 }, // tl
    { sx: 1, sy: -1 }, // tr
    { sx: 1, sy: 1 }, // br
    { sx: -1, sy: 1 }, // bl
  ];

  const axisMag = Math.max(Math.abs(clampedNx), Math.abs(clampedNy));
  const diagMag = Math.hypot(clampedNx, clampedNy);
  const shearScale = axisMag > 0 ? axisMag / diagMag : 1;

  return corners.map(({ sx, sy }) => {
    const restX = cx + sx * hw;
    const restY = cy + sy * hh;
    const translateX = clampedNx * hw;
    const translateY = clampedNy * hh;
    const shearX = clampedNy * hw * WIDTH_T * sx * -sy * shearScale;
    const shearY = clampedNx * hh * EDGE_T * sx * -sy * shearScale;

    return {
      x: restX + translateX + shearX,
      y: restY + translateY + shearY,
    };
  }) as [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }, { x: number; y: number }];
}

function miniPath(
  w: number,
  h: number,
  ox = 0,
  oy = 0,
  nx = 0,
  ny = 0,
  scale = 1,
): string {
  const [tl, tr, br, bl] = miniPathCorners(w, h, ox, oy, nx, ny, scale);
  return makeRoundedQuadPath(tl, tr, br, bl, PORTAL_R);
}

function collapsedPath(w: number, h: number): string {
  const cx = w / 2;
  const cy = h / 2;
  return makeRoundedRectPath(
    { x: cx - 0.5, y: cy - 0.5 },
    { x: cx + 0.5, y: cy - 0.5 },
    { x: cx + 0.5, y: cy + 0.5 },
    { x: cx - 0.5, y: cy + 0.5 },
    0.1,
  );
}

// Interpolate corners from current portal shape -> full screen for click animation
function interpPath(
  w: number,
  h: number,
  t: number,
  start: ReturnType<typeof miniPathCorners>,
): string {
  const pad = 3;
  const [startTl, startTr, startBr, startBl] = start;

  const lerp = (a: number, b: number) => a + (b - a) * t;

  const tl = {
    x: lerp(startTl.x, -pad),
    y: lerp(startTl.y, -pad),
  };
  const tr = {
    x: lerp(startTr.x, w + pad),
    y: lerp(startTr.y, -pad),
  };
  const br = {
    x: lerp(startBr.x, w + pad),
    y: lerp(startBr.y, h + pad),
  };
  const bl = {
    x: lerp(startBl.x, -pad),
    y: lerp(startBl.y, h + pad),
  };

  const cornerR = PORTAL_R + (R - PORTAL_R) * t;
  return makeRoundedQuadPath(tl, tr, br, bl, cornerR);
}

export default function ZentryHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const borderRefs = useRef<(SVGPathElement | null)[]>([]);
  const sizeRef = useRef({ w: 1080, h: 910 });

  // Use refs for indices so animations always read current values
  const activeRef = useRef(0);
  const nextRef = useRef(1);

  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [cursorPointer, setCursorPointer] = useState(false);

  useEffect(() => {
    if (loadedCount >= 2) setReady(true);
  }, [loadedCount]);

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        sizeRef.current = {
          w: containerRef.current.offsetWidth,
          h: containerRef.current.offsetHeight,
        };
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const applyPath = useCallback((index: number, path: string) => {
    const content = slideRefs.current[index];
    const border = borderRefs.current[index];
    if (content) content.style.clipPath = `path("${path}")`;
    if (border) border.setAttribute("d", path);
  }, []);

  const applyInner = useCallback(
    (
      index: number,
      opts: {
        scale?: number;
        rotateX?: number;
        rotateY?: number;
        rotateZ?: number;
      },
    ) => {
      const inner = innerRefs.current[index];
      if (!inner) return;
      const s = opts.scale ?? 1;
      const rx = opts.rotateX ?? 0;
      const ry = opts.rotateY ?? 0;
      const rz = opts.rotateZ ?? 0;
      inner.style.transform = `translate3d(0px, 0px, 0px) rotateX(${rx}rad) rotateY(${ry}rad) rotateZ(${rz}rad) scale(${s})`;
    },
    [],
  );

  // Setup a slide as active/next/hidden — called imperatively, not via useEffect
  const setupSlide = useCallback(
    (index: number, role: "active" | "next" | "hidden") => {
      const { w, h } = sizeRef.current;
      const el = slideRefs.current[index]?.parentElement;
      if (!el) return;

      if (role === "active") {
        el.style.display = "";
        el.style.zIndex = "1";
        applyPath(index, fullPath(w, h));
        applyInner(index, { scale: 1 });
        videoRefs.current[index]?.play().catch(() => {});
      } else if (role === "next") {
        el.style.display = "";
        el.style.zIndex = "2";
        applyPath(index, miniPath(w, h, 0, 0, 0, 0, 0));
        applyInner(index, { scale: 0.8 });
      } else {
        el.style.display = "none";
        el.style.zIndex = "0";
        applyPath(index, collapsedPath(w, h));
        applyInner(index, { scale: 1 });
        const video = videoRefs.current[index];
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      }
    },
    [applyPath, applyInner],
  );

  // One-time initialization
  useEffect(() => {
    VIDEOS.forEach((_, i) => {
      if (i === 0) setupSlide(i, "active");
      else if (i === 1) setupSlide(i, "next");
      else setupSlide(i, "hidden");
    });
  }, [setupSlide]);

  const tiltTarget = useRef({ rx: 0, ry: 0 });
  const tiltCurrent = useRef({ rx: 0, ry: 0 });
  const rafRef = useRef<number>(0);
  const isInsideZone = useRef(false);
  const lastMouseRef = useRef({ px: 0, py: 0 });
  const resumePortalRef = useRef<(() => void) | null>(null);
  const portalAnimRef = useRef({ nx: 0, ny: 0, scale: HOVER_SCALE });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const MAX_TILT = 0.55;
    const ZONE_W = HALF_W * HOVER_SCALE;
    const ZONE_H = HALF_H * HOVER_SCALE;
    const FILL_DURATION = 1200; // ms to go 0 → 1
    const DRAIN_DURATION = 800; // ms to go 1 → 0
    const BREATHE_AMP = 0.06;
    const BREATHE_SPEED = 0.002;

    let fillLevel = 0;
    // State machine: "idle" | "filling" | "full" | "draining"
    // "filling" = mouse moving anywhere in hero
    // "full"    = fillLevel reached 1 (keep at 1 while in zone or still moving)
    // "draining"= mouse stopped outside zone
    let phase: "idle" | "filling" | "draining" = "idle";
    let breatheStart = 0;
    let lastTick = performance.now();
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function tick(now: number) {
      const dt = Math.min(now - lastTick, 50); // cap dt to avoid jumps
      lastTick = now;

      if (phase === "filling" || isInsideZone.current) {
        // Fill toward 1
        fillLevel = Math.min(1, fillLevel + dt / FILL_DURATION);
        if (fillLevel >= 1 && breatheStart === 0) {
          breatheStart = now;
        }
      } else if (phase === "draining") {
        fillLevel = Math.max(0, fillLevel - dt / DRAIN_DURATION);
        if (fillLevel === 0) {
          phase = "idle";
          breatheStart = 0;
        }
      }

      // Smooth tilt
      const tc = tiltCurrent.current;
      const tt = tiltTarget.current;
      tc.rx = lerp(tc.rx, tt.rx, 0.08);
      tc.ry = lerp(tc.ry, tt.ry, 0.08);

      const ni = nextRef.current;
      const { w, h } = sizeRef.current;
      const nx = tc.ry / MAX_TILT;
      const ny = -tc.rx / MAX_TILT;

      // Breathing only once portal is fully open and inside zone
      const breathe =
        isInsideZone.current && fillLevel >= 1 && breatheStart > 0
          ? 1 + Math.sin((now - breatheStart) * BREATHE_SPEED) * BREATHE_AMP
          : 1;

      const sc = fillLevel * HOVER_SCALE * breathe;
      portalAnimRef.current = { nx, ny, scale: sc };
      applyPath(ni, miniPath(w, h, 0, 0, nx, ny, sc));
      applyInner(ni, { scale: 0.8 });

      rafRef.current = requestAnimationFrame(tick);
    }

    function onStopMoving() {
      // Only drain if mouse is not in the zone
      if (!isInsideZone.current) {
        phase = "draining";
      }
    }

    function onMouseMove(e: MouseEvent) {
      const rect = container!.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      lastMouseRef.current = { px, py };

      const { w, h } = sizeRef.current;
      const nx = Math.max(-1, Math.min(1, (px - w / 2) / (w / 2)));
      const ny = Math.max(-1, Math.min(1, (py - h / 2) / (h / 2)));
      tiltTarget.current.ry = nx * MAX_TILT;
      tiltTarget.current.rx = -ny * MAX_TILT;

      const inZone =
        Math.abs(px - w / 2) < ZONE_W && Math.abs(py - h / 2) < ZONE_H;

      if (isAnimating.current) {
        if (inZone) {
          isInsideZone.current = true;
          phase = "filling";
          setCursorPointer(true);
        } else {
          isInsideZone.current = false;
          setCursorPointer(false);
        }
        return;
      }

      // Mouse is moving → always filling (unless inside zone where we already hold at 1)
      phase = "filling";

      // Reset idle timer
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(onStopMoving, 80);

      if (inZone) {
        if (!isInsideZone.current) {
          isInsideZone.current = true;
          breatheStart = fillLevel >= 1 ? performance.now() : 0;
          setCursorPointer(true);
        }
      } else {
        if (isInsideZone.current) {
          isInsideZone.current = false;
          setCursorPointer(false);
        }
      }
    }

    resumePortalRef.current = () => {
      const { px, py } = lastMouseRef.current;
      const { w, h } = sizeRef.current;
      const inZone =
        Math.abs(px - w / 2) < ZONE_W && Math.abs(py - h / 2) < ZONE_H;

      const nx = Math.max(-1, Math.min(1, (px - w / 2) / (w / 2)));
      const ny = Math.max(-1, Math.min(1, (py - h / 2) / (h / 2)));
      tiltTarget.current.ry = nx * MAX_TILT;
      tiltTarget.current.rx = -ny * MAX_TILT;

      fillLevel = 0;
      breatheStart = 0;

      if (inZone) {
        isInsideZone.current = true;
        phase = "filling";
        setCursorPointer(true);
      } else {
        isInsideZone.current = false;
        phase = "idle";
        setCursorPointer(false);
      }
    };

    function onMouseLeave() {
      if (idleTimer) clearTimeout(idleTimer);
      isInsideZone.current = false;
      setCursorPointer(false);
      tiltTarget.current = { rx: 0, ry: 0 }; // lerps back smoothly
      phase = "draining";
    }

    rafRef.current = requestAnimationFrame(tick);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (idleTimer) clearTimeout(idleTimer);
      resumePortalRef.current = null;
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [applyPath, applyInner]);

  function handleClick() {
    if (isAnimating.current) return;
    if (!isInsideZone.current) return; // only clickable inside portal zone

    isAnimating.current = true;
    isInsideZone.current = false;
    setCursorPointer(false);

    const { w, h } = sizeRef.current;
    const oldActive = activeRef.current;
    const newActive = nextRef.current;
    const newNext = (newActive + 1) % VIDEOS.length;

    const { nx, ny, scale } = portalAnimRef.current;
    const expandStart = miniPathCorners(w, h, 0, 0, nx, ny, scale);

    const oldVideo = videoRefs.current[oldActive];
    if (oldVideo) {
      oldVideo.pause();
      oldVideo.currentTime = 0;
    }

    // Bring expanding slide on top
    const expandEl = slideRefs.current[newActive]?.parentElement;
    if (expandEl) {
      expandEl.style.display = "";
      expandEl.style.zIndex = "3";
    }
    videoRefs.current[newActive]?.play().catch(() => {});

    // Show and start scaling the next portal immediately
    setupSlide(newNext, "next");
    nextRef.current = newNext;
    const nextEl = slideRefs.current[newNext]?.parentElement;
    if (nextEl) nextEl.style.zIndex = "4";
    resumePortalRef.current?.();

    applyPath(newActive, interpPath(w, h, 0, expandStart));

    const proxy = { t: 0 };
    gsap.to(proxy, {
      t: 1,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        const t = proxy.t;
        applyPath(newActive, interpPath(w, h, t, expandStart));
        applyInner(newActive, {
          scale: 0.8 + t * 0.2,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
        });
      },
      onComplete: () => {
        // Old active -> hidden
        setupSlide(oldActive, "hidden");

        // New active settles at z-index 1
        if (expandEl) expandEl.style.zIndex = "1";
        applyPath(newActive, fullPath(w, h));
        applyInner(newActive, { scale: 1 });

        activeRef.current = newActive;

        if (nextEl) nextEl.style.zIndex = "2";

        isAnimating.current = false;
      },
    });
  }

  return (
    <div
      ref={containerRef}
      className="relative h-dvh w-screen overflow-hidden bg-black"
      style={{ cursor: cursorPointer ? "pointer" : "default" }}
      onClick={handleClick}
    >
      {!ready && (
        <div className="flex-center absolute z-[100] h-full w-full bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>
      )}

      {VIDEOS.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{ zIndex: i === 0 ? 1 : 0, display: i > 1 ? "none" : "" }}
        >
          <div
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="absolute inset-0"
            style={{ willChange: "clip-path" }}
          >
            <div
              ref={(el) => {
                innerRefs.current[i] = el;
              }}
              className="absolute inset-0"
              style={{ transformOrigin: "center center" }}
            >
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                playsInline
                loop
                preload="metadata"
                poster={POSTERS[i]}
                src={src}
                onLoadedData={() => setLoadedCount((c) => c + 1)}
              />
            </div>
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none"
              stroke="#000"
              strokeWidth="2"
              fill="none"
              style={{ zIndex: 1 }}
            >
              <path
                ref={(el) => {
                  borderRefs.current[i] = el;
                }}
              />
            </svg>
          </div>
        </div>
      ))}

      <div className="absolute inset-0 z-40 flex flex-col justify-between pointer-events-none">
        <div className="mt-24 px-5 sm:px-10">
          <h1 className="special-font text-blue-100 text-5xl sm:text-7xl md:text-9xl font-black uppercase">
            redefi<b>n</b>e
          </h1>
          <p className="mb-5 max-w-64 text-blue-100 font-robert-regular text-sm sm:text-base">
            Enter the Metagame Layer <br /> Unleash the Play Economy
          </p>
        </div>
        <div className="flex justify-end p-5 sm:p-10">
          <h1 className="special-font text-blue-75 text-5xl sm:text-7xl md:text-9xl font-black uppercase">
            G<b>a</b>ming
          </h1>
        </div>
      </div>

      <h1 className="special-font absolute bottom-5 right-5 text-black text-5xl sm:text-7xl md:text-9xl font-black uppercase pointer-events-none">
        G<b>a</b>ming
      </h1>
    </div>
  );
}
