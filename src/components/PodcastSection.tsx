import { useRef, useState } from "react";
import { Headphones, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAudio } from "@/contexts/AudioContext";
import { formatCount } from "@/hooks/useMetrics";

import type { ColumnRecord } from "@/hooks/useColumns";
import type { PodcastEpisode } from "@/data/articles";

/* ---------- Equalizer animation ---------- */
const Equalizer = () => (
  <span className="inline-flex items-end gap-[2px] h-3">
    {[1, 2, 3].map((i) => (
      <span
        key={i}
        className="w-[2.5px] rounded-full bg-primary"
        style={{ animation: `eq-bar 0.8s ease-in-out ${i * 0.15}s infinite alternate` }}
      />
    ))}
    <style>{`@keyframes eq-bar { 0% { height: 20%; } 100% { height: 100%; } }`}</style>
  </span>
);

/* ---------- Platform SVG icons ---------- */
const SpotifyIcon = () => (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
    <path d="M10 1.8c-4.5 0-8.2 3.7-8.2 8.2s3.7 8.2 8.2 8.2 8.2-3.7 8.2-8.2S14.5 1.8 10 1.8zm3.7 11.8c-.2.3-.5.3-.7.2-2-.5-4.4-.6-7.3-.3-.3.1-.5-.1-.6-.4-.1-.3.1-.5.4-.6 3.2-.3 5.8-.2 8 .4.3.1.3.4.2.7zm1-1.9c-.2.3-.6.4-.9.2-2.3-1.4-5.7-1.8-8.4-1-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8 3-1 6.8-.5 9.5 1.1.3.2.4.6.2.9zm.1-2c-2.7-1.6-7.2-1.7-9.8-.9-.4.1-.8-.1-.9-.5-.1-.4.1-.8.5-.9 3-1 7.9-.8 11 1.1.4.2.5.7.3 1-.2.3-.7.4-1.1.2z" />
  </svg>
);
const AppleIcon = () => (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
    <path d="M15.7 13.5c-.3.5-.7 1-1.1 1.4-.7.7-1.3 1.1-1.8 1.1-.3 0-.7-.1-1.2-.3-.5-.2-.9-.3-1.3-.3-.4 0-.8.1-1.3.3-.5.2-.9.3-1.2.3-.7 0-1.4-.5-2.1-1.5-.8-1.1-1.2-2.3-1.2-3.7 0-1.2.3-2.2.9-3 .5-.7 1.2-1 2-1 .4 0 .9.1 1.4.3.5.2.9.3 1 .3.2 0 .6-.1 1.1-.3.5-.2 1-.3 1.3-.3.5 0 1 .1 1.5.4.4.3.8.6 1 1.1-.4.3-.8.6-1 1-.3.5-.4 1-.4 1.5 0 .6.2 1.2.5 1.7.3.4.6.8 1 1zM12 3.7c0 .5-.2 1-.5 1.5-.4.5-.9.9-1.5 1h-.1c0-.4.2-.9.5-1.4.4-.5.9-.9 1.5-1 0-.1.1-.1.1-.1z" />
  </svg>
);
const YouTubeIcon = () => (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
    <path d="M17.8 6.2s-.2-1.2-.7-1.7c-.6-.7-1.3-.7-1.7-.7C13 3.5 10 3.5 10 3.5s-3 0-5.4.3c-.3 0-1.1 0-1.7.7-.5.5-.7 1.7-.7 1.7S2 7.6 2 9v1.3c0 1.4.2 2.8.2 2.8s.2 1.2.7 1.7c.6.7 1.5.7 1.8.7 1.3.1 5.3.2 5.3.2s3 0 5.4-.2c.3 0 1.1 0 1.7-.7.5-.5.7-1.7.7-1.7s.2-1.4.2-2.8V9c0-1.4-.2-2.8-.2-2.8zM8.3 12.5V7l4.6 2.8-4.6 2.7z" />
  </svg>
);

const PlatformButton = ({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) => (
  <a
    href={href}
    className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition-all hover:bg-foreground hover:text-background hover:border-foreground"
  >
    {icon}
    {label}
  </a>
);

/** Convert a ColumnRecord to a PodcastEpisode for the AudioContext */
const toPodcastEpisode = (col: ColumnRecord): PodcastEpisode => ({
  id: String(col.id),
  title: col.titulo,
  description: col.sinopsis,
  duration: "",
  date: new Date(col.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }),
  image: col.img1,
  isNew: false,
  audioUrl: col.url_transistor || col.url_podcast || undefined,
  plays: 0,
  columnId: col.id,
  columnText: col.columna || undefined,
});

interface PodcastSectionProps {
  columns: ColumnRecord[];
  loading: boolean;
  error: string | null;
}

const PodcastSection = ({ columns = [], loading, error }: PodcastSectionProps) => {
  const { episode: activeEpisode, isPlaying, play } = useAudio();
  const playedRef = useRef<Set<string>>(new Set());

  const EPISODES_PER_PAGE = 5;
  const [episodePage, setEpisodePage] = useState(0);

  // Filter columns that have audio
  const withAudio = columns.filter((c) => c.url_podcast || c.url_transistor);
  const featured = withAudio[0] ?? null;
  const allRest = withAudio.slice(1);
  const totalPages = Math.max(1, Math.ceil(allRest.length / EPISODES_PER_PAGE));
  const rest = allRest.slice(episodePage * EPISODES_PER_PAGE, (episodePage + 1) * EPISODES_PER_PAGE);

  const handlePlay = (col: ColumnRecord) => {
    const ep = toPodcastEpisode(col);
    const isSameEp = activeEpisode?.id === ep.id;
    if (!isSameEp && !playedRef.current.has(ep.id)) {
      playedRef.current.add(ep.id);
    }
    play(ep);
  };

  const isActiveAndPlaying = (id: number) => activeEpisode?.id === String(id) && isPlaying;
  const isActive = (id: number) => activeEpisode?.id === String(id);

  if (!loading && !error && withAudio.length === 0) return null;

  return (
    <section id="podcast" className="bg-podcast py-16 md:py-24">
        <div className="container">
          {/* Section header */}
          <div className="flex items-center gap-3">
            <Headphones size={28} className="text-foreground" />
            <h2 className="font-editorial text-3xl font-bold tracking-tight md:text-4xl">Podcast</h2>
          </div>
          <p className="mt-2 text-muted-foreground">Escucha la historia detrás de cada columna, en voz de Jonathan</p>

          {/* Platform buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <PlatformButton icon={<SpotifyIcon />} label="Spotify" href="#" />
            <PlatformButton icon={<AppleIcon />} label="Apple Podcasts" href="#" />
            <PlatformButton icon={<YouTubeIcon />} label="YouTube" href="#" />
          </div>

          {/* Error */}
          {error && (
            <p className="mt-8 text-center text-sm text-destructive">Error al cargar contenido, intenta refrescar.</p>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div
              className="mt-6 flex flex-col overflow-hidden rounded-lg border border-border md:flex-row"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
            >
              <div className="flex w-full flex-col bg-secondary/40 p-5 md:w-[40%] md:p-6 lg:p-8">
                <Skeleton className="aspect-square w-full rounded-md" />
                <Skeleton className="mt-4 h-6 w-3/4" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-2/3" />
                <Skeleton className="mt-4 h-10 w-40 rounded-full" />
              </div>
              <div className="flex w-full flex-col border-t border-border md:w-[60%] md:border-l md:border-t-0">
                <div className="border-b border-border px-5 py-3">
                  <Skeleton className="h-3 w-32" />
                </div>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 border-b border-border px-5 py-4">
                    <Skeleton className="h-4 w-7" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-7 w-7 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          {!loading && !error && featured && (
            <div
              className="mt-6 flex flex-col overflow-hidden rounded-lg border border-border md:flex-row"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
            >
              {/* LEFT — Featured Episode */}
              <div className="flex w-full flex-col bg-secondary/40 p-5 md:w-[40%] md:p-6 lg:p-8">
                <div className="relative">
                  <img
                    src={featured.img1}
                    alt={featured.titulo}
                    className="aspect-square w-full rounded-md object-cover"
                    loading="lazy"
                  />
                  <Badge className="absolute left-2.5 top-2.5 rounded-none bg-primary text-primary-foreground text-[10px] uppercase tracking-widest border-0 font-mono">
                    Nuevo
                  </Badge>
                </div>

                <h3 className="mt-4 font-editorial text-xl font-extrabold leading-snug md:text-2xl">
                  {featured.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">{featured.sinopsis}</p>
                <div className="mt-2 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                  <time>
                    {new Date(featured.created_at).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>

                <Button onClick={() => handlePlay(featured)} className="mt-4 w-fit rounded-full px-6">
                  {isActiveAndPlaying(featured.id) ? (
                    <>
                      <Pause size={16} /> Pausar
                    </>
                  ) : (
                    <>
                      <Play size={16} className="ml-0.5" /> Escuchar ahora
                    </>
                  )}
                </Button>
              </div>

              {/* RIGHT — Episode list */}
              <div
                className="flex w-full flex-col border-t border-border md:w-[60%] md:border-l md:border-t-0"
                style={{ backgroundColor: "#F8F9FA" }}
              >
                <div className="border-b border-border px-5 py-3">
                  <h4 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Episodios anteriores
                  </h4>
                </div>

                <ScrollArea className="max-h-[400px] md:max-h-none md:flex-1">
                  <div className="divide-y divide-border">
                    {rest.map((ep, idx) => {
                      const active = isActive(ep.id);
                      const playing = isActiveAndPlaying(ep.id);
                      return (
                        <button
                          key={ep.id}
                          onClick={() => handlePlay(ep)}
                          className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[hsl(48_100%_97%)]"
                        >
                          <span className="shrink-0 font-mono text-xs font-semibold text-muted-foreground w-7">
                            {idx + 1}
                          </span>

                          <span
                            className={`flex flex-1 items-center gap-2 truncate text-sm font-medium ${active ? "text-foreground font-bold" : ""}`}
                          >
                            {playing && <Equalizer />}
                            {ep.titulo}
                          </span>

                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                            {playing ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
    </section>
  );
};

export default PodcastSection;
