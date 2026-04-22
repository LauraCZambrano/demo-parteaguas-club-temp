import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Ad, AdZone } from "@/hooks/useArticleAds";
import { trackAdClick, trackAdImpression } from "@/lib/adTracking";
import adFallback from "@/assets/ad-fallback.jpg";

interface AdSlotProps {
  zone: AdZone;
  ads: Ad[];
  articleSlug: string;
  articleCategory: string;
  className?: string;
}

const FALLBACK_AD: Ad = {
  id: "fallback-promocionate",
  zone: "A",
  category: "global",
  url_image: adFallback,
  url_video: null,
  url_destination: "mailto:contacto@parteaguas.club?subject=Quiero%20promocionarme%20en%20Parteaguas",
  advertiser: "Parteaguas",
  alt_text: "¿Quieres promocionarte aquí? Contáctanos",
  priority: 999,
};

const ROTATION_MS = 8000;

const ZONE_HEIGHT: Record<AdZone, string> = {
  A: "h-[50px] md:h-[90px]",
  B: "",
  C: "h-[50px] md:h-[90px]",
};

export function AdSlot({ zone, ads, articleSlug, articleCategory, className }: AdSlotProps) {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const impressionsRef = useRef<Set<string>>(new Set());

  // Reset when ads change
  useEffect(() => {
    setIndex(0);
    impressionsRef.current = new Set();
  }, [ads]);

  // Intersection Observer: track visibility (>=50%)
  useEffect(() => {
    const node = containerRef.current;
    if (!node || ads.length === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.5),
      { threshold: [0, 0.5, 1] }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ads.length]);

  // Register impression for currently visible ad
  useEffect(() => {
    if (!isVisible || ads.length === 0) return;
    const current = ads[index];
    if (!current) return;
    const key = String(current.id);
    if (impressionsRef.current.has(key)) return;
    impressionsRef.current.add(key);
    trackAdImpression({
      ad_id: current.id,
      event_type: "impression",
      article_slug: articleSlug,
      article_category: articleCategory,
    });
  }, [isVisible, index, ads, articleSlug, articleCategory]);

  // Carousel rotation
  useEffect(() => {
    if (ads.length <= 1 || isHovered) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % ads.length);
    }, ROTATION_MS);
    return () => clearInterval(t);
  }, [ads.length, isHovered]);

  // Zone B has no fallback (es slot 300x250 in-content); A & C muestran house ad
  if (!ads || ads.length === 0) {
    if (zone === "B") return null;
    const fb = { ...FALLBACK_AD, zone };
    return (
      <div ref={containerRef} className={cn("w-full", className)}>
        <span className="block text-[10px] text-muted-foreground text-left mb-1">Publicidad</span>
        <a
          href={fb.url_destination}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "block w-full overflow-hidden rounded-sm bg-[#F4F4F5]",
            ZONE_HEIGHT[zone]
          )}
        >
          <img
            src={fb.url_image ?? ""}
            alt={fb.alt_text ?? "Publicidad"}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </a>
      </div>
    );
  }

  const current = ads[index];
  const isVideo = zone === "B" && !!current.url_video;

  const handleClick = () => {
    trackAdClick({
      ad_id: current.id,
      event_type: "click",
      article_slug: articleSlug,
      article_category: articleCategory,
    });
  };

  // Zone B: 300x250 video/image
  if (zone === "B") {
    return (
      <div
        ref={containerRef}
        className={cn("w-full flex flex-col items-center", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="block text-[10px] text-muted-foreground text-left mb-1 w-full max-w-[300px]">
          Publicidad
        </span>
        <a
          href={current.url_destination}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="relative block w-[300px] h-[250px] overflow-hidden rounded-sm bg-[#F4F4F5] transition-opacity duration-500"
          key={current.id}
        >
          {isVideo ? (
            <video
              src={current.url_video!}
              autoPlay
              muted
              loop
              playsInline
              width={300}
              height={250}
              className="block h-[250px] w-[300px] object-cover"
            />
          ) : (
            <img
              src={current.url_image ?? ""}
              alt={current.alt_text ?? "Publicidad"}
              loading="lazy"
              width={300}
              height={250}
              className="block h-[250px] w-[300px] object-cover"
            />
          )}
          <div className="absolute top-2 right-2 z-10 rounded-full bg-black/50 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-sm">
            Publicidad
          </div>
        </a>
      </div>
    );
  }

  // Zone A & C: banner
  return (
    <div
      ref={containerRef}
      className={cn("w-full", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="block text-[10px] text-muted-foreground text-left mb-1">Publicidad</span>
      <a
        href={current.url_destination}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        key={current.id}
        className={cn(
          "block w-full overflow-hidden rounded-sm bg-[#F4F4F5] transition-opacity duration-500",
          ZONE_HEIGHT[zone]
        )}
      >
        <img
          src={current.url_image ?? ""}
          alt={current.alt_text ?? "Publicidad"}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </a>
    </div>
  );
}

export default AdSlot;
