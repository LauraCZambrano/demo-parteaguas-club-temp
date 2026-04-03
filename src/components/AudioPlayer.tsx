import { useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Pause, RotateCcw, X, FileText } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";
import { slugify } from "@/lib/slugify";

const formatTime = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const AudioPlayer = () => {
  const { episode, isPlaying, currentTime, duration, speed, togglePlay, rewind15, seek, cycleSpeed, close } = useAudio();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = progressBarRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seek(ratio);
    },
    [seek]
  );

  if (!episode) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasAudio = !!episode.audioUrl;
  const hasColumnText = !!episode.columnId;

  return (
    <>
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
          <img
            src={episode.image}
            alt={episode.title}
            className="h-12 w-12 shrink-0 rounded object-cover"
          />

          <div className="mr-auto min-w-0 flex items-center gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{episode.title}</p>
              <p className="truncate font-mono text-xs text-muted-foreground">
                {hasAudio ? `${formatTime(currentTime)} / ${formatTime(duration)}` : episode.duration}
              </p>
            </div>

            {/* Read column button — only visible when column text exists */}
            {hasColumnText && (
              <button
                onClick={() => navigate(`/articulo/${slugify(episode.title)}`)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                <FileText size={13} />
                Leer columna
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile-only read column icon */}
            {hasColumnText && (
              <button
                onClick={() => navigate(`/articulo/${episode.columnId}`)}
                className="flex sm:hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Leer columna"
              >
                <FileText size={16} />
              </button>
            )}

            <button
              onClick={rewind15}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
              aria-label="Retroceder 15 segundos"
            >
              <RotateCcw size={18} />
              <span className="absolute text-[8px] font-bold leading-none" style={{ marginTop: 1 }}>15</span>
            </button>

            <button
              onClick={togglePlay}
              disabled={!hasAudio}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50"
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>

            <button
              onClick={cycleSpeed}
              className="flex h-9 min-w-[3rem] items-center justify-center rounded-full border border-border font-mono text-xs font-semibold transition-colors hover:bg-muted"
            >
              {speed}x
            </button>

            <button
              onClick={close}
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Cerrar reproductor"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default AudioPlayer;
