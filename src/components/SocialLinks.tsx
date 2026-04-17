import { Instagram, Youtube, Music2 } from "lucide-react";

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

export const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://www.instagram.com/parteaguasclub", Icon: Instagram },
  { name: "X (Twitter)", href: "https://x.com/parteaguasclub", Icon: XIcon },
  { name: "YouTube", href: "https://www.youtube.com/@parteaguasclub", Icon: Youtube },
  { name: "Spotify", href: "https://open.spotify.com/show/parteaguas", Icon: Music2 },
] as const;

interface SocialLinksProps {
  /** Visual variant. `light` for dark backgrounds (footer), `default` for light backgrounds. */
  variant?: "default" | "light";
  size?: "sm" | "md";
  className?: string;
}

const SocialLinks = ({ variant = "default", size = "md", className = "" }: SocialLinksProps) => {
  const dim = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const iconSize = size === "sm" ? 16 : 18;

  const styles =
    variant === "light"
      ? "border-background/20 text-background hover:bg-primary hover:text-primary-foreground hover:border-primary"
      : "border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary";

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {SOCIAL_LINKS.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} de Parteaguas Club`}
          className={`inline-flex items-center justify-center rounded-full border transition-colors ${dim} ${styles}`}
        >
          <Icon size={iconSize} />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
