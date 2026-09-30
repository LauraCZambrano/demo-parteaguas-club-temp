import { Instagram, Linkedin, Youtube } from "lucide-react";
import { useBrand } from "@/hooks/useBrand";

const XIcon = ({ size = 18, className }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2H21l-6.52 7.45L22 22h-6.797l-4.77-6.231L4.8 22H2.043l6.974-7.97L2 2h6.914l4.31 5.696L18.244 2Zm-2.385 18.4h1.85L7.235 3.5H5.27L15.86 20.4Z" />
  </svg>
);

const TikTokIcon = ({ size = 18, className }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.65a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.08Z" />
  </svg>
);

// Demo copy: the links are the ones the owner set in Tarimah (Diseño y
// contenido → Redes sociales), not Parteaguas' own accounts.
const ICONS: Record<string, ({ size }: { size?: number }) => JSX.Element> = {
  Instagram: ({ size }) => <Instagram size={size} />,
  LinkedIn: ({ size }) => <Linkedin size={size} />,
  "X (Twitter)": ({ size }) => <XIcon size={size} />,
  TikTok: ({ size }) => <TikTokIcon size={size} />,
  YouTube: ({ size }) => <Youtube size={size} />,
};

interface SocialLinksProps {
  /** Visual variant. `light` for dark backgrounds (footer), `default` for light backgrounds. */
  variant?: "default" | "light";
  size?: "sm" | "md";
  className?: string;
}

const SocialLinks = ({ variant = "default", size = "md", className = "" }: SocialLinksProps) => {
  const brand = useBrand();
  const dim = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const iconSize = size === "sm" ? 16 : 18;

  const styles =
    variant === "light"
      ? "border-background/20 text-background hover:bg-primary hover:text-primary-foreground hover:border-primary"
      : "border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary";

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {brand.socials.map(({ name, href }) => {
        const Icon = ICONS[name];
        return (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} de ${brand.name}`}
          className={`inline-flex items-center justify-center rounded-full border transition-colors ${dim} ${styles}`}
        >
          <Icon size={iconSize} />
        </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
