import { useState } from "react";
import { BookOpen, ExternalLink, ChevronDown, ChevronUp, Plus, Minus } from "lucide-react";

interface SourcesSectionProps {
  sources: { title: string; url: string | null; detail: string | null }[] | null;
}

const ExpandableSource = ({
  title,
  rest,
  url,
}: {
  title: string;
  rest: string;
  url: string | null;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex-1">
      <div className="flex items-start gap-2">
        <span className="flex-1 text-foreground">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-wrap items-baseline gap-1 underline decoration-muted-foreground/30 underline-offset-2 transition-colors hover:decoration-primary hover:text-primary"
            >
              {title}
              <ExternalLink size={12} className="ml-0.5 inline-block translate-y-[1px] flex-shrink-0" />
            </a>
          ) : (
            title
          )}
        </span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted-foreground/10 hover:text-foreground"
          aria-label={open ? "Ocultar detalle" : "Ver detalle"}
        >
          {open ? <Minus size={14} /> : <Plus size={14} />}
        </button>
      </div>
      {open && (
        <p className="mt-2 text-muted-foreground animate-fade-in">{rest}</p>
      )}
    </div>
  );
};

const SourcesSection = ({ sources: raw }: SourcesSectionProps) => {
  const [visible, setVisible] = useState(true);
  if (!raw || raw.length === 0) return null;

  const sources = raw.map((s) => {
    const detail = s.detail?.trim();
    if (detail) return { kind: "expandable" as const, title: s.title, rest: detail, url: s.url };
    if (s.url) return { kind: "link" as const, text: s.title, url: s.url };
    return { kind: "plain" as const, text: s.title };
  });

  return (
    <div className="mt-16 border-t border-border pt-8">
      <button
        onClick={() => setVisible((v) => !v)}
        className="flex w-full items-center gap-2 mb-5 group cursor-pointer"
      >
        <BookOpen size={18} className="text-muted-foreground" />
        <h4 className="font-editorial text-base font-bold tracking-tight text-foreground">
          Fuentes y referencias
        </h4>
        <span className="ml-auto text-muted-foreground transition-colors group-hover:text-foreground">
          {visible ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {visible && (
        <ol className="space-y-3 list-none animate-fade-in">
          {sources.map((src, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground transition-colors hover:bg-muted"
            >
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-muted-foreground">
                {i + 1}
              </span>
              {src.kind === "link" && (
                <span className="flex-1">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-wrap items-baseline gap-1 text-foreground underline decoration-muted-foreground/30 underline-offset-2 transition-colors hover:decoration-primary hover:text-primary"
                  >
                    {src.text}
                    <ExternalLink size={12} className="ml-0.5 inline-block translate-y-[1px] flex-shrink-0" />
                  </a>
                </span>
              )}
              {src.kind === "expandable" && (
                <ExpandableSource title={src.title} rest={src.rest} url={src.url} />
              )}
              {src.kind === "plain" && (
                <span className="flex-1 text-foreground">{src.text}</span>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default SourcesSection;
