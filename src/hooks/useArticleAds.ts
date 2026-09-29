export type AdZone = "A" | "B" | "C";

export interface Ad {
  id: number | string;
  zone: AdZone;
  category: string;
  url_image: string | null;
  url_video: string | null;
  url_destination: string;
  advertiser: string | null;
  alt_text: string | null;
  priority: number;
  assignment_type?: "specific" | "category" | "global";
}

export interface ZoneAds {
  ads: Ad[];
  hasSpecific: boolean;
}

const EMPTY_ZONE: ZoneAds = { ads: [], hasSpecific: false };
const EMPTY_ADS: Record<AdZone, ZoneAds> = { A: EMPTY_ZONE, B: EMPTY_ZONE, C: EMPTY_ZONE };

// Sin fuente de anuncios: los espacios muestran siempre las imágenes de reserva.
export const useArticleAds = () => ({ ads: EMPTY_ADS, loading: false });
