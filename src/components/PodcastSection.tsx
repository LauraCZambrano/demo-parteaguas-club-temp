import { useRef, useState, useCallback, useEffect } from "react";
import { Headphones, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAudio } from "@/contexts/AudioContext";
import { useBrand } from "@/hooks/useBrand";

const FALLBACK_IMAGE = "/placeholder.svg";

import type { PodcastEpisode } from "@/data/articles";
import { useTransistorPodcasts, type TransistorEpisode } from "@/hooks/useTransistorPodcasts";

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

/** Strip HTML tags and decode common entities from a string. Safe text-only output. */
const stripHtml = (html: string): string => {
  if (!html) return "";
  // Remove tags
  const noTags = html.replace(/<[^>]*>/g, " ");
  // Decode common HTML entities
  const decoded = noTags
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&hellip;/gi, "…")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–");
  // Collapse whitespace
  return decoded.replace(/\s+/g, " ").trim();
};

/** Convert a Transistor episode to the AudioContext PodcastEpisode shape. */
const toPodcastEpisode = (ep: TransistorEpisode): PodcastEpisode => ({
  id: String(ep.id),
  title: ep.title,
  description: ep.summary || ep.description || "",
  duration: typeof ep.duration === "string" ? ep.duration : "",
  date: ep.published_at
    ? new Date(ep.published_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })
    : "",
  image: ep.image_url || FALLBACK_IMAGE,
  isNew: false,
  audioUrl: ep.media_url,
  plays: 0,
});

const EPISODE_ROW_HEIGHT = 57;
const HEADER_HEIGHT = 44;
const PAGINATION_HEIGHT = 45;

const PodcastSection = () => {
  const { episode: activeEpisode, isPlaying, play } = useAudio();
  const { data: episodes, loading, error } = useTransistorPodcasts();
  const { name: brandName } = useBrand();
  const playedRef = useRef<Set<string>>(new Set());
  const listContainerRef = useRef<HTMLDivElement>(null);

  const [episodesPerPage, setEpisodesPerPage] = useState(10);
  const [episodePage, setEpisodePage] = useState(0);

  const featured = episodes[0] ?? null;
  const allRest = episodes.slice(1);

  const totalPages = Math.max(1, Math.ceil(allRest.length / episodesPerPage));
  const rest = allRest.slice(episodePage * episodesPerPage, (episodePage + 1) * episodesPerPage);

  // Adaptive page size on desktop, fixed 10 on mobile per spec
  const calcFit = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setEpisodesPerPage(10);
      setEpisodePage((prev) => Math.min(prev, Math.max(0, Math.ceil(allRest.length / 10) - 1)));
      return;
    }
    const container = listContainerRef.current;
    if (!container) return;
    const available = container.clientHeight - HEADER_HEIGHT - PAGINATION_HEIGHT;
    const fit = Math.max(1, Math.floor(available / EPISODE_ROW_HEIGHT));
    setEpisodesPerPage(fit);
    setEpisodePage((prev) => Math.min(prev, Math.max(0, Math.ceil(allRest.length / fit) - 1)));
  }, [allRest.length]);

  useEffect(() => {
    calcFit();
    const container = listContainerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(calcFit);
    observer.observe(container);
    return () => observer.disconnect();
  }, [calcFit]);

  const handlePlay = (ep: TransistorEpisode) => {
    const podcast = toPodcastEpisode(ep);
    if (activeEpisode?.id !== podcast.id && !playedRef.current.has(podcast.id)) {
      playedRef.current.add(podcast.id);
    }
    play(podcast);
  };

  const isActiveAndPlaying = (id: string | number) => activeEpisode?.id === String(id) && isPlaying;
  const isActive = (id: string | number) => activeEpisode?.id === String(id);

  if (!loading && !error && episodes.length === 0) return null;

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <section id="podcast" className="bg-podcast py-16 md:py-24">
      <div className="container">
        {/* Section header */}
        <div className="flex items-center gap-3">
          <Headphones size={28} className="text-foreground" />
          <h2 className="font-editorial text-3xl font-bold tracking-tight md:text-4xl">Podcast</h2>
        </div>
        <p className="mt-2 text-muted-foreground">Escucha cada columna en voz de {brandName}</p>


        {/* Error */}
        {error && (
          <p className="mt-8 text-center text-sm text-destructive">Error al cargar episodios, intenta refrescar.</p>
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
                  src={featured.image_url || FALLBACK_IMAGE}
                  alt={featured.title}
                  className="aspect-square w-full rounded-md object-cover"
                  loading="lazy"
                />
                <Badge className="absolute left-2.5 top-2.5 rounded-none bg-primary text-primary-foreground text-[10px] uppercase tracking-widest border-0 font-mono">
                  Nuevo
                </Badge>
              </div>

              <h3 className="mt-4 font-editorial text-xl font-extrabold leading-snug md:text-2xl">
                {featured.title}
              </h3>
              {(featured.summary || featured.description) && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {stripHtml(featured.summary || featured.description || "")}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <time>{formatDate(featured.published_at)}</time>
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
              ref={listContainerRef}
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
                          {episodePage * episodesPerPage + idx + 2}
                        </span>

                        <span
                          className={`flex flex-1 items-center gap-2 text-sm font-medium leading-snug ${active ? "text-foreground font-bold" : ""}`}
                        >
                          {playing && <Equalizer />}
                          {ep.title}
                        </span>

                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                          {playing ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border px-5 py-2.5">
                  <button
                    onClick={() => setEpisodePage((p) => Math.max(0, p - 1))}
                    disabled={episodePage === 0}
                    className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={14} /> Anterior
                  </button>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {episodePage + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setEpisodePage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={episodePage >= totalPages - 1}
                    className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Siguiente <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PodcastSection;
