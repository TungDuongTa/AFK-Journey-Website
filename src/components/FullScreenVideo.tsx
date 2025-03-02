import { useRef } from "react";

interface FullScreenVideoProps {
  isPlaying: boolean;
  onEnded: () => void;
}

export default function FullScreenVideo({
  isPlaying,
  onEnded,
}: FullScreenVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  if (!isPlaying) return null; // Don't render if not playing

  return (
    <div className="flex-center fixed inset-0 z-50 bg-black">
      <video
        ref={videoRef}
        src="videos/loadingVideo.mp4"
        autoPlay
        muted
        onEnded={onEnded}
        className="w-full h-full object-cover"
        preload="auto"
      />
    </div>
  );
}
