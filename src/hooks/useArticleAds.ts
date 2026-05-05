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
  assignment_type?: "specific" | "category" | "global";
}

/**
 * Fetch ads for a given column + zone using the `get_ads_for_column` RPC.
 * The RPC handles specific assignments, category match, and "Global" fallback,
 * all ordered by priority DESC.
 */
const fetchAdsForZone = async (
  columnId: number,
  zone: AdZone
): Promise<Ad[]> => {
  const { data, error } = await (supabase as any).rpc("get_ads_for_column", {
    p_column_id: columnId,
    p_zone: zone,
  });
  if (error) {
    console.warn("[ads] rpc error", error.message);
    return [];
  }
  return (data?.ads ?? []) as Ad[];
};

export const useArticleAds = (columnId: number | undefined | null) => {
  const [ads, setAds] = useState<Record<AdZone, Ad[]>>({ A: [], B: [], C: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!columnId) {
      setAds({ A: [], B: [], C: [] });
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchAdsForZone(columnId, "A"),
      fetchAdsForZone(columnId, "B"),
      fetchAdsForZone(columnId, "C"),
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
  }, [columnId]);

  return { ads, loading };
};
