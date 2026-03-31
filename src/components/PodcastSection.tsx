import { useState } from "react";
import { Headphones, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { podcastEpisodes, type PodcastEpisode } from "@/data/articles";
import AudioPlayer from "@/components/AudioPlayer";

/* ---------- Equalizer animation ---------- */
const Equalizer = () => (
  <span className="inline-flex items-end gap-[2px] h-3">
    {[1, 2, 3].map((i) => (
      <span
        key={i}
        className="w-[2.5px] rounded-full bg-primary"
        style={{
          animation: `eq-bar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
        }}
      />
    ))}
    <style>{`
      @keyframes eq-bar {
        0%   { height: 20%; }
        100% { height: 100%; }
      }
    `}</style>
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

const PodcastSection = () => {
  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode | null>(null);

  const featured = podcastEpisodes[0];
  const rest = podcastEpisodes.slice(1);

  const play = (ep: PodcastEpisode) =>
    setActiveEpisode((prev) => (prev?.id === ep.id ? null : ep));

  const isActive = (id: string) => activeEpisode?.id === id;

  return (
    <>
      <section id="podcast" className="bg-podcast py-16 md:py-24">
        <div className="container">
          {/* ── Section header ── */}
          <div className="flex items-center gap-3">
            <Headphones size={28} className="text-foreground" />
            <h2 className="font-editorial text-3xl font-bold tracking-tight md:text-4xl">
              Podcast
            </h2>
          </div>
          <p className="mt-2 text-muted-foreground">
            Conversaciones largas con las mentes más interesantes.
          </p>

          {/* ── Platform buttons row ── */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <PlatformButton icon={<SpotifyIcon />} label="Spotify" href="#" />
            <PlatformButton icon={<AppleIcon />} label="Apple Podcasts" href="#" />
            <PlatformButton icon={<YouTubeIcon />} label="YouTube" href="#" />
          </div>

          {/* ── The Podcast Hub — Two-column dashboard ── */}
          <div className="mt-6 flex flex-col overflow-hidden rounded-lg border border-border md:flex-row" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            {/* LEFT — Featured Episode (40%) */}
            <div className="flex w-full flex-col bg-secondary/40 p-5 md:w-[40%] md:p-6 lg:p-8">
              {/* Cover */}
              <div className="relative">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="aspect-square w-full rounded-md object-cover"
                  loading="lazy"
                />
                {featured.isNew && (
                  <Badge className="absolute left-2.5 top-2.5 rounded-none bg-primary text-primary-foreground text-[10px] uppercase tracking-widest border-0 font-mono">
                    Nuevo
                  </Badge>
                )}
              </div>

              {/* Info */}
              <h3 className="mt-4 font-editorial text-xl font-extrabold leading-snug md:text-2xl">
                {featured.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {featured.description}
              </p>
              <div className="mt-2 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <span>{featured.duration}</span>
                <span>·</span>
                <time>{featured.date}</time>
              </div>

              {/* CTA */}
              <button
                onClick={() => play(featured)}
                className="mt-4 inline-flex w-fit items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isActive(featured.id) ? (
                  <>
                    <Equalizer /> Reproduciendo…
                  </>
                ) : (
                  <>
                    <Play size={16} className="ml-0.5" /> Escuchar ahora
                  </>
                )}
              </button>
            </div>

            {/* RIGHT — Episode list (60%) */}
            <div className="flex w-full flex-col border-t border-border bg-card md:w-[60%] md:border-l md:border-t-0">
              <div className="border-b border-border px-5 py-3">
                <h4 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Episodios anteriores
                </h4>
              </div>

              <ScrollArea className="max-h-[400px] md:max-h-none md:flex-1">
                <div className="divide-y divide-border">
                  {rest.map((ep) => {
                    const epNum = ep.title.match(/Ep\.\s*(\d+)/)?.[1] ?? "";
                    const active = isActive(ep.id);
                    return (
                      <button
                        key={ep.id}
                        onClick={() => play(ep)}
                        className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[hsl(48_100%_97%)]"
                      >
                        {/* Episode number */}
                        <span className="shrink-0 font-mono text-xs font-semibold text-muted-foreground w-7">
                          {epNum}
                        </span>

                        {/* Title + equalizer */}
                        <span className={`flex flex-1 items-center gap-2 truncate text-sm font-medium ${active ? "text-primary" : ""}`}>
                          {active && <Equalizer />}
                          {ep.title.replace(/Ep\.\s*\d+\s*—\s*/, "")}
                        </span>

                        {/* Duration */}
                        <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                          {ep.duration}
                        </span>

                        {/* Play / Pause icon */}
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                          {active ? (
                            <Pause size={12} />
                          ) : (
                            <Play size={12} className="ml-0.5" />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky audio player ── */}
      <AudioPlayer episode={activeEpisode} onClose={() => setActiveEpisode(null)} />
    </>
  );
};

export default PodcastSection;
