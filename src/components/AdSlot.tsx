import { cn } from "@/lib/utils";
import adPlaceholderBanner from "@/assets/ad-placeholder-banner.jpg";

interface AdSlotProps {
  zone: "A" | "B" | "C";
  className?: string;
}

const ZONE_CONFIG = {
  A: {
    label: "A",
    desktopSize: "728x90",
    mobileSize: "320x50",
    heightClasses: "min-h-[50px] md:min-h-[90px]",
  },
  C: {
    label: "C",
    desktopSize: "728x90",
    mobileSize: "320x50",
    heightClasses: "min-h-[50px] md:min-h-[90px]",
  },
} as const;

export function AdSlot({ zone, className }: AdSlotProps) {
  // Special video preview for Zone B
  if (zone === "B") {
    return (
      <div className={cn("w-full flex flex-col items-center", className)}>
        {/* Legal Label */}
        <span className="block text-[10px] text-muted-foreground text-left mb-1 w-full max-w-[300px]">
          Publicidad
        </span>

        {/* Video Preview Container — fixed 300x250 */}
        <div className="relative w-[300px] h-[250px] overflow-hidden rounded-sm bg-[#F4F4F5]">
          {/* Animated gradient simulating muted autoplay video */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(120deg, hsl(45 90% 60%), hsl(220 70% 55%), hsl(280 60% 55%), hsl(160 70% 50%))",
              backgroundSize: "300% 300%",
              animation: "adslot-gradient 6s ease infinite",
            }}
          />

          {/* Dark overlay for legibility */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Play icon + label centered */}
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-white px-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/40">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="mt-3 text-sm font-semibold tracking-wide">
              Video Muted / Autoplay
            </p>
            <p className="mt-1 text-[11px] text-white/80 font-mono">
              300×250 · H.264
            </p>
          </div>

          {/* Internal note badge */}
          <div className="absolute top-2 left-2 z-10 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white/90">
            Alto impacto · CPM 2–4x
          </div>
        </div>

        {/* Inline keyframes for the gradient */}
        <style>{`
          @keyframes adslot-gradient {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </div>
    );
  }

  // Default static slot for Zones A and C
  const config = ZONE_CONFIG[zone];

  return (
    <div className={cn("w-full", className)}>
      {/* Legal Label */}
      <span className="block text-[10px] text-muted-foreground text-left mb-1">
        Publicidad
      </span>

      {/* Ad Container — placeholder banner */}
      <div
        className={cn(
          "w-full overflow-hidden rounded-sm bg-[#F4F4F5]",
          config.heightClasses
        )}
      >
        <img
          src={adPlaceholderBanner}
          alt={`Espacio publicitario ${config.label} — Síguenos en redes sociales`}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}

export default AdSlot;
