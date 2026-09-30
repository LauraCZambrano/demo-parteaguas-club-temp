import { useEffect, useState } from "react";
import { listEpisodes } from "@/lib/tarimah";

export type TransistorEpisode = {
  id: string | number;
  title: string;
  summary?: string;
  description?: string;
  image_url?: string | null;
  media_url: string;
  published_at?: string;
  duration?: number | string;
  number?: number;
};

/**
 * Demo copy: the episodes come from Tarimah (`/sites/v1/{handle}/episodes` —
 * published columns with a podcast) instead of the Transistor feed of
 * Parteaguas behind n8n. Same shape as before, so PodcastSection is untouched.
 */
export const useTransistorPodcasts = () => {
  const [data, setData] = useState<TransistorEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listEpisodes()
      .then((page) => {
        if (cancelled) return;
        setData(
          page.items
            .filter((c) => c.urlPodcast)
            .map((c) => ({
              id: c.slug ?? c.title ?? "",
              title: c.title ?? "",
              summary: c.seoSynopsis ?? undefined,
              image_url: c.img1,
              media_url: c.urlPodcast as string,
              published_at: c.publishedAt ?? undefined,
            })),
        );
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error desconocido");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
};
