import { BookOpen, ExternalLink } from "lucide-react";

interface SourcesSectionProps {
  fuentes: string;
}

const URL_REGEX = /https?:\/\/[^\s)]+/g;

const parseSource = (line: string) => {
  const urls = line.match(URL_REGEX);
  if (!urls || urls.length === 0) {
    return { text: line.trim(), url: null };
  }
  const url = urls[0];
  let text = line.replace(url, "").replace(/[,\-–—:•]\s*$/, "").replace(/^\s*[,\-–—:•]\s*/, "").trim();
  if (!text) {
    try {
      const hostname = new URL(url).hostname.replace("www.", "");
      text = hostname;
    } catch {
      text = url;
    }
  }
  return { text, url };
};

const SourcesSection = ({ fuentes }: SourcesSectionProps) => {
  const lines = fuentes
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return null;

  const sources = lines.map(parseSource);

  return (
    <div className="mt-16 border-t border-border pt-8">
      <div className="flex items-center gap-2 mb-5">
        <BookOpen size={18} className="text-muted-foreground" />
        <h4 className="font-editorial text-base font-bold tracking-tight text-foreground">
          Fuentes y referencias
        </h4>
      </div>

      <ol className="space-y-3 list-none">
        {sources.map((src, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground transition-colors hover:bg-muted"
          >
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
              {i + 1}
            </span>
            <span className="flex-1">
              {src.url ? (
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-wrap items-baseline gap-1 text-foreground underline decoration-muted-foreground/30 underline-offset-2 transition-colors hover:decoration-primary hover:text-primary"
                >
                  {src.text}
                  <ExternalLink size={12} className="ml-0.5 inline-block translate-y-[1px] flex-shrink-0" />
                </a>
              ) : (
                <span className="text-foreground">{src.text}</span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default SourcesSection;
