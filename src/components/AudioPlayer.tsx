import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { PodcastEpisode } from "@/data/articles";

interface AudioPlayerProps {
  episode: PodcastEpisode | null;
  onClose: () => void;
}

const SPEEDS = [1, 1.5, 2];

const AudioPlayer = ({ episode, onClose }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(0);

  // Reset on episode change
  useEffect(() => {
    if (episode) {
      setIsPlaying(true);
      setProgress(0);
      setSpeedIdx(0);
    }
  }, [episode?.id]);

  // Fake progress ticker
  useEffect(() => {
    if (!isPlaying || !episode) return;
    const id = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 0.3 * SPEEDS[speedIdx]));
    }, 300);
    return () => clearInterval(id);
  }, [isPlaying, episode, speedIdx]);

  const rewind = useCallback(() => setProgress((p) => Math.max(0, p - 5)), []);

  if (!episode) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      {/* Progress bar on top edge */}
      <Progress value={progress} className="h-1 rounded-none bg-muted" />

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
            {episode.duration}
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
            onClick={() => setIsPlaying((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
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
            onClick={onClose}
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
