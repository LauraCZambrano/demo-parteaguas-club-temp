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
  // Zone B — Video advertisement (300×250)
  if (zone === "B") {
    return (
      <div className={cn("w-full flex flex-col items-center", className)}>
        {/* Legal Label */}
        <span className="block text-[10px] text-muted-foreground text-left mb-1 w-full max-w-[300px]">
          Publicidad
        </span>

        {/* Video Container — 300×250 */}
        <div className="relative w-[300px] h-[250px] overflow-hidden rounded-sm bg-[#F4F4F5]">
          <video
            src="https://res.cloudinary.com/dfdy3dt9h/video/upload/v1776797362/Video_de_Anuncio_de_Podcast_ui6ahg.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          
          {/* Subtle "Publicidad" badge overlay */}
          <div className="absolute top-2 right-2 z-10 rounded-full bg-black/50 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-sm">
            Publicidad
          </div>
        </div>
      </div>
    );
  }

// Zone C — Specific banner from Cloudinary
  if (zone === "C") {
    return (
      <div className={cn("w-full", className)}>
        {/* Legal Label */}
        <span className="block text-[10px] text-muted-foreground text-left mb-1">
          Publicidad
        </span>

        {/* Ad Container — Cloudinary banner */}
        <div className="w-full overflow-hidden rounded-sm bg-[#F4F4F5] min-h-[50px] md:min-h-[90px]">
          <img
            src="https://res.cloudinary.com/dfdy3dt9h/image/upload/v1776796272/banner_b_g8xzo8.jpg"
            alt="Espacio publicitario C"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    );
  }

  // Default static slot for Zone A
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
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

export default AdSlot;
