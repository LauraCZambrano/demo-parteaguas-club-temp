import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
}

const GLOBAL_CATEGORY = "global";

/**
 * Fetch active ads for the given category+zone directly from the `ads` table.
 * Mirrors the intended logic of `get_ads_by_category_and_zone`:
 *  - is_active = true
 *  - now between starts_at and ends_at
 *  - matches zone
 *  - matches category (case-insensitive); if none, fall back to "global"
 *  - ordered by priority ASC, then by created_at ASC (oldest campaign first)
 */
const fetchAdsForZone = async (category: string, zone: AdZone): Promise<Ad[]> => {
  const nowIso = new Date().toISOString();
  const tryCategory = async (cat: string): Promise<Ad[]> => {
    const { data, error } = await (supabase as any)
      .from("ads")
      .select(
        "id,zone,category,url_image,url_video,url_destination,advertiser,alt_text,priority,starts_at,ends_at,is_active"
      )
      .eq("is_active", true)
      .eq("zone", zone)
      .ilike("category", cat)
      .lte("starts_at", nowIso)
      .gte("ends_at", nowIso)
      .order("priority", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) {
      console.warn("[ads] fetch error", error.message);
      return [];
    }
    return (data ?? []) as Ad[];
  };

  let ads = await tryCategory(category);
  if (ads.length === 0) {
    ads = await tryCategory(GLOBAL_CATEGORY);
  }
  return ads;
};

export const useArticleAds = (category: string | undefined | null) => {
  const [ads, setAds] = useState<Record<AdZone, Ad[]>>({ A: [], B: [], C: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) {
      setAds({ A: [], B: [], C: [] });
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchAdsForZone(category, "A"),
      fetchAdsForZone(category, "B"),
      fetchAdsForZone(category, "C"),
    ])
      .then(([a, b, c]) => {
        if (!cancelled) setAds({ A: a, B: b, C: c });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category]);

  return { ads, loading };
};
