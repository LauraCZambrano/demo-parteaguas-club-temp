import { useState } from "react";
import { Headphones, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { podcastEpisodes } from "@/data/articles";

/* ---------- Equalizer animation ---------- */
const Equalizer = () => (
  <span className="inline-flex items-end gap-[2px] h-3.5">
    {[1, 2, 3].map((i) => (
      <span
        key={i}
        className="w-[3px] rounded-full bg-primary"
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

/* ---------- Shared card border style ---------- */
const cardBase =
  "border border-border bg-card transition-all duration-200 hover:shadow-lg hover:border-primary rounded-lg overflow-hidden";

const PodcastSection = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const featured = podcastEpisodes[0];
  const rest = podcastEpisodes.slice(1);

  const toggle = (id: string) => setPlayingId((prev) => (prev === id ? null : id));

  return (
    <section id="podcast" className="bg-podcast py-16 md:py-24">
      <div className="container">
        {/* ── Header row ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Headphones size={28} className="text-foreground" />
              <h2 className="font-editorial text-3xl font-bold tracking-tight md:text-4xl">
                Podcast
              </h2>
            </div>
            <p className="mt-2 text-muted-foreground">
              Conversaciones largas con las mentes más interesantes.
            </p>
          </div>

          {/* Platform badges */}
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-3.5 py-2 text-xs font-medium text-background transition-opacity hover:opacity-80"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                <path d="M10 1.8c-4.5 0-8.2 3.7-8.2 8.2s3.7 8.2 8.2 8.2 8.2-3.7 8.2-8.2S14.5 1.8 10 1.8zm3.7 11.8c-.2.3-.5.3-.7.2-2-.5-4.4-.6-7.3-.3-.3.1-.5-.1-.6-.4-.1-.3.1-.5.4-.6 3.2-.3 5.8-.2 8 .4.3.1.3.4.2.7zm1-1.9c-.2.3-.6.4-.9.2-2.3-1.4-5.7-1.8-8.4-1-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8 3-1 6.8-.5 9.5 1.1.3.2.4.6.2.9zm.1-2c-2.7-1.6-7.2-1.7-9.8-.9-.4.1-.8-.1-.9-.5-.1-.4.1-.8.5-.9 3-1 7.9-.8 11 1.1.4.2.5.7.3 1-.2.3-.7.4-1.1.2z" />
              </svg>
              Spotify
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-3.5 py-2 text-xs font-medium text-background transition-opacity hover:opacity-80"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                <path d="M15.7 13.5c-.3.5-.7 1-1.1 1.4-.7.7-1.3 1.1-1.8 1.1-.3 0-.7-.1-1.2-.3-.5-.2-.9-.3-1.3-.3-.4 0-.8.1-1.3.3-.5.2-.9.3-1.2.3-.7 0-1.4-.5-2.1-1.5-.8-1.1-1.2-2.3-1.2-3.7 0-1.2.3-2.2.9-3 .5-.7 1.2-1 2-1 .4 0 .9.1 1.4.3.5.2.9.3 1 .3.2 0 .6-.1 1.1-.3.5-.2 1-.3 1.3-.3.5 0 1 .1 1.5.4.4.3.8.6 1 1.1-.4.3-.8.6-1 1-.3.5-.4 1-.4 1.5 0 .6.2 1.2.5 1.7.3.4.6.8 1 1zM12 3.7c0 .5-.2 1-.5 1.5-.4.5-.9.9-1.5 1h-.1c0-.4.2-.9.5-1.4.4-.5.9-.9 1.5-1 0-.1.1-.1.1-.1z" />
              </svg>
              Apple Podcasts
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-3.5 py-2 text-xs font-medium text-background transition-opacity hover:opacity-80"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                <path d="M17.8 6.2s-.2-1.2-.7-1.7c-.6-.7-1.3-.7-1.7-.7C13 3.5 10 3.5 10 3.5s-3 0-5.4.3c-.3 0-1.1 0-1.7.7-.5.5-.7 1.7-.7 1.7S2 7.6 2 9v1.3c0 1.4.2 2.8.2 2.8s.2 1.2.7 1.7c.6.7 1.5.7 1.8.7 1.3.1 5.3.2 5.3.2s3 0 5.4-.2c.3 0 1.1 0 1.7-.7.5-.5.7-1.7.7-1.7s.2-1.4.2-2.8V9c0-1.4-.2-2.8-.2-2.8zM8.3 12.5V7l4.6 2.8-4.6 2.7z" />
              </svg>
              YouTube
            </a>
          </div>
        </div>

        {/* ── Featured episode ── */}
        <div className={`${cardBase} mt-10`}>
          <div className="flex flex-col md:flex-row">
            {/* Cover */}
            <div className="relative aspect-square w-full shrink-0 md:w-[45%] lg:w-[40%]">
              <img
                src={featured.image}
                alt={featured.title}
                className="h-full w-full object-cover"
                loading="lazy"
                width={800}
                height={800}
              />
              {/* Play overlay */}
              <button
                onClick={() => toggle(featured.id)}
                className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 transition-opacity hover:opacity-100 focus:opacity-100"
                aria-label={playingId === featured.id ? "Pausar" : `Reproducir ${featured.title}`}
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-110">
                  {playingId === featured.id ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                </span>
              </button>
              {/* New badge */}
              {featured.isNew && (
                <Badge className="absolute left-3 top-3 rounded-sm bg-primary text-primary-foreground text-[10px] uppercase tracking-widest border-0">
                  Nuevo
                </Badge>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-center gap-4 p-6 md:p-8 lg:p-10">
              <div>
                <h3 className="font-editorial text-xl font-bold leading-snug md:text-2xl lg:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {featured.description}
                </p>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                <span>{featured.duration}</span>
                <span>·</span>
                <time>{featured.date}</time>
              </div>
              <button
                onClick={() => toggle(featured.id)}
                className="mt-1 inline-flex w-fit items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {playingId === featured.id ? (
                  <>
                    <Equalizer /> Escuchando
                  </>
                ) : (
                  <>
                    <Play size={16} className="ml-0.5" /> Escuchar ahora
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Secondary episodes ── */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {rest.map((ep) => (
            <div key={ep.id} className={cardBase}>
              <div className="flex gap-4 p-4">
                {/* Small cover */}
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md">
                  <img
                    src={ep.image}
                    alt={ep.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    width={512}
                    height={512}
                  />
                  <button
                    onClick={() => toggle(ep.id)}
                    className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 transition-opacity hover:opacity-100 focus:opacity-100"
                    aria-label={playingId === ep.id ? "Pausar" : `Reproducir ${ep.title}`}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                      {playingId === ep.id ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                    </span>
                  </button>
                </div>

                {/* Text */}
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <h3 className="font-editorial text-sm font-bold leading-snug md:text-base">
                    {ep.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {ep.description}
                  </p>
                  <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                    {playingId === ep.id && <Equalizer />}
                    <span>{ep.duration}</span>
                    <span>·</span>
                    <time>{ep.date}</time>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;
