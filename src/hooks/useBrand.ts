import { useQuery } from "@tanstack/react-query";
import { getSite, type SiteProfile } from "@/lib/tarimah";

export interface SocialLink {
  name: string;
  href: string;
}

export interface Brand {
  /** Name to show while the profile loads, and when it has none. */
  name: string;
  logo: string | null;
  profile: SiteProfile | null;
  socials: SocialLink[];
}

const FALLBACK_NAME = (import.meta.env.VITE_SITE_NAME as string | undefined) ?? "Mi sitio";

/**
 * Demo copy: the site's identity (name, logo, socials, about) comes from the
 * Tarimah profile of the handle it reads, instead of being hard-coded — the
 * "valores de marca en tu API" promise of ADR-08, exercised for real.
 */
export const useBrand = (): Brand => {
  const { data } = useQuery({ queryKey: ["site-profile"], queryFn: getSite, staleTime: 60_000 });
  const profile = data ?? null;
  const socials: SocialLink[] = [
    { name: "Instagram", href: profile?.instagramUrl ?? "" },
    { name: "LinkedIn", href: profile?.linkedinUrl ?? "" },
    { name: "X (Twitter)", href: profile?.xUrl ?? "" },
    { name: "TikTok", href: profile?.tiktokUrl ?? "" },
    { name: "YouTube", href: profile?.youtubeUrl ?? "" },
  ].filter((link) => link.href);

  return {
    name: profile?.clientName ?? FALLBACK_NAME,
    logo: profile?.logo ?? null,
    profile,
    socials,
  };
};
