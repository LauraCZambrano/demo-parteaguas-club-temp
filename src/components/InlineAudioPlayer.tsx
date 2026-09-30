import { useRef, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";
import { useBrand } from "@/hooks/useBrand";
import type { PodcastEpisode } from "@/data/articles";

const formatTime = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

interface InlineAudioPlayerProps {
  episode: PodcastEpisode;
  label?: string;
}

/**
 * Horizontal inline audio player widget.
 * Uses the global AudioContext so it stays in sync with the sticky bottom player.
 */
const InlineAudioPlayer = ({ episode, label = "Escuchar resumen de la nota" }: InlineAudioPlayerProps) => {
  const brand = useBrand();
  const { episode: activeEpisode, isPlaying, currentTime, duration, play, togglePlay, rewind15, seek } = useAudio();
  const progressRef = useRef<HTMLDivElement>(null);

  const isThis = activeEpisode?.id === episode.id;
  const playing = isThis && isPlaying;
  const time = isThis ? currentTime : 0;
  const total = isThis ? duration : 0;
  const progress = total > 0 ? (time / total) * 100 : 0;

  const handleMainClick = useCallback(() => {
    if (isThis) togglePlay();
    else play(episode);
  }, [isThis, togglePlay, play, episode]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isThis) return;
      const bar = progressRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seek(ratio);
    },
    [isThis, seek]
  );

  return (
    <div className="flex w-full items-center gap-3 rounded-full border border-border bg-card px-3 py-2 sm:w-auto sm:min-w-[360px]">
      {brand.logo && (
        <img src={brand.logo} alt={brand.name} className="h-9 w-9 shrink-0 rounded-full object-contain" />
      )}

      <button
        onClick={handleMainClick}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
        aria-label={playing ? "Pausar" : "Reproducir"}
      >
        {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      </button>

      <button
        onClick={() => isThis && rewind15()}
        disabled={!isThis}
        className="relative hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted disabled:opacity-40 sm:flex"
        aria-label="Retroceder 15 segundos"
      >
        <RotateCcw size={16} />
        <span className="absolute text-[7px] font-bold leading-none" style={{ marginTop: 1 }}>15</span>
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-xs font-medium text-foreground">
          {isThis ? episode.title : label}
        </span>
        <div className="flex items-center gap-2">
          <div
            ref={progressRef}
            onClick={handleSeek}
            className={`relative h-1 flex-1 overflow-hidden rounded-full bg-muted ${isThis ? "cursor-pointer" : ""}`}
          >
            <div
              className="absolute inset-y-0 left-0 bg-primary transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
            {formatTime(time)} / {isThis ? formatTime(total) : "--:--"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InlineAudioPlayer;
