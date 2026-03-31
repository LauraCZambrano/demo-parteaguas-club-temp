import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import type { PodcastEpisode } from "@/data/articles";

interface AudioPlayerProps {
  episode: PodcastEpisode | null;
  onClose: () => void;
}

const SPEEDS = [1, 1.5, 2];

const formatTime = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const AudioPlayer = ({ episode, onClose }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Create / swap audio source on episode change
  useEffect(() => {
    if (!episode) return;

    // If no audio element yet, create one
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    const src = episode.audioUrl || "";

    // Only reload if src actually changed
    if (audio.src !== src && src) {
      audio.src = src;
      audio.load();
    }

    audio.playbackRate = SPEEDS[speedIdx];

    if (src) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }

    // Reset speed on new episode
    setSpeedIdx(0);
    audio.playbackRate = 1;

    return () => {
      // Don't destroy audio on unmount of effect — we want persistence
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode?.id]);

  // Bind audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onDurationChange);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onDurationChange);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
    };
  }, [episode?.id]);

  // Sync play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !episode?.audioUrl) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, episode?.audioUrl]);

  // Sync speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = SPEEDS[speedIdx];
    }
  }, [speedIdx]);

  const togglePlay = useCallback(() => setIsPlaying((v) => !v), []);

  const rewind = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
    }
  }, []);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = progressBarRef.current;
      const audio = audioRef.current;
      if (!bar || !audio || !isFinite(audio.duration)) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = ratio * audio.duration;
    },
    []
  );

  const handleClose = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    onClose();
  }, [onClose]);

  if (!episode) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasAudio = !!episode.audioUrl;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      {/* Clickable progress bar */}
      <div
        ref={progressBarRef}
        onClick={handleProgressClick}
        className="relative h-1.5 w-full cursor-pointer bg-muted"
      >
        <div
          className="absolute inset-y-0 left-0 bg-primary transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="container flex items-center gap-4 py-3">
        {/* Cover */}
        <img
          src={episode.image}
          alt={episode.title}
          className="h-12 w-12 shrink-0 rounded object-cover"
        />

        {/* Info */}
        <div className="mr-auto min-w-0">
          <p className="truncate text-sm font-semibold">{episode.title}</p>
          <p className="truncate font-mono text-xs text-muted-foreground">
            {hasAudio
              ? `${formatTime(currentTime)} / ${formatTime(duration)}`
              : episode.duration}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Rewind 15s */}
          <button
            onClick={rewind}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
            aria-label="Retroceder 15 segundos"
          >
            <RotateCcw size={18} />
            <span className="absolute text-[8px] font-bold leading-none" style={{ marginTop: 1 }}>
              15
            </span>
          </button>

          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            disabled={!hasAudio}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50"
            aria-label={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>

          {/* Speed */}
          <button
            onClick={() => setSpeedIdx((i) => (i + 1) % SPEEDS.length)}
            className="flex h-9 min-w-[3rem] items-center justify-center rounded-full border border-border font-mono text-xs font-semibold transition-colors hover:bg-muted"
          >
            {SPEEDS[speedIdx]}x
          </button>

          {/* Close */}
          <button
            onClick={handleClose}
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Cerrar reproductor"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
