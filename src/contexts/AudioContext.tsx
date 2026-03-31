import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import type { PodcastEpisode } from "@/data/articles";

interface AudioState {
  episode: PodcastEpisode | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: number;
}

interface AudioContextValue extends AudioState {
  play: (ep: PodcastEpisode) => void;
  togglePlay: () => void;
  pause: () => void;
  seek: (ratio: number) => void;
  rewind15: () => void;
  cycleSpeed: () => void;
  close: () => void;
}

const SPEEDS = [1, 1.5, 2];

const Ctx = createContext<AudioContextValue | null>(null);

export const useAudio = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be inside AudioProvider");
  return ctx;
};

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(0);

  // Lazily create the Audio element
  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    return audioRef.current;
  }, []);

  // Play an episode (or toggle if same)
  const play = useCallback(
    (ep: PodcastEpisode) => {
      const audio = getAudio();

      // Same episode → toggle
      if (episode?.id === ep.id) {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          audio.play().then(() => setIsPlaying(true)).catch(() => {});
        }
        return;
      }

      // New episode
      setEpisode(ep);
      setCurrentTime(0);
      setDuration(0);
      setSpeedIdx(0);
      audio.playbackRate = 1;

      const src = ep.audioUrl || "";
      if (src) {
        audio.src = src;
        audio.load();
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(false);
      }
    },
    [episode?.id, isPlaying, getAudio]
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !episode?.audioUrl) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying, episode?.audioUrl]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const seek = useCallback((ratio: number) => {
    const audio = audioRef.current;
    if (audio && isFinite(audio.duration)) {
      audio.currentTime = ratio * audio.duration;
    }
  }, []);

  const rewind15 = useCallback(() => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.max(0, audio.currentTime - 15);
  }, []);

  const cycleSpeed = useCallback(() => {
    setSpeedIdx((i) => {
      const next = (i + 1) % SPEEDS.length;
      if (audioRef.current) audioRef.current.playbackRate = SPEEDS[next];
      return next;
    });
  }, []);

  const close = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    setEpisode(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  // Bind audio events
  useEffect(() => {
    const audio = getAudio();
    const onTime = () => setCurrentTime(audio.currentTime);
    const onDur = () => setDuration(audio.duration);
    const onEnd = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDur);
    audio.addEventListener("durationchange", onDur);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDur);
      audio.removeEventListener("durationchange", onDur);
      audio.removeEventListener("ended", onEnd);
    };
  }, [getAudio]);

  return (
    <Ctx.Provider
      value={{
        episode,
        isPlaying,
        currentTime,
        duration,
        speed: SPEEDS[speedIdx],
        play,
        togglePlay,
        pause,
        seek,
        rewind15,
        cycleSpeed,
        close,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};
