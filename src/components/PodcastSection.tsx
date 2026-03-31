import { Headphones, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { podcastEpisodes } from "@/data/articles";

const PodcastSection = () => {
  return (
    <section id="podcast" className="bg-podcast py-16 md:py-24">
      <div className="container">
        <div className="flex items-center gap-3">
          <Headphones size={28} className="text-foreground" />
          <h2 className="font-editorial text-3xl font-bold tracking-tight md:text-4xl">
            Podcast
          </h2>
        </div>
        <p className="mt-2 text-muted-foreground">
          Conversaciones largas con las mentes más interesantes.
        </p>

        <div className="mt-10 space-y-4">
          {podcastEpisodes.map((ep) => (
            <div
              key={ep.id}
              className="flex items-start gap-4 rounded-sm border bg-background p-5 transition-shadow hover:shadow-md"
            >
              <button
                className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110"
                aria-label={`Reproducir ${ep.title}`}
              >
                <Play size={18} className="ml-0.5" />
              </button>
              <div className="min-w-0 flex-1">
                <h3 className="font-editorial text-base font-bold leading-snug">{ep.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {ep.description}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{ep.duration}</span>
                  <span>·</span>
                  <time>{ep.date}</time>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="outline" size="sm" className="gap-2 rounded-sm">
            🎵 Spotify
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-sm">
            🍎 Apple Podcasts
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-sm">
            📺 YouTube
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;
