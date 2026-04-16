import { useEffect, useState } from "react";

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

const WEBHOOK_URL = "https://ericdacodes.app.n8n.cloud/webhook/get-transistor-podcasts";

/** Best-effort extraction of an episode array from various n8n payload shapes. */
const extractEpisodes = (payload: unknown): TransistorEpisode[] => {
  if (!payload) return [];
  // Prefer payload.data.data
  const anyP = payload as Record<string, unknown>;
  const dataA = anyP.data as Record<string, unknown> | unknown[] | undefined;
  if (Array.isArray(dataA)) return dataA as TransistorEpisode[];
  if (dataA && typeof dataA === "object") {
    const dataB = (dataA as Record<string, unknown>).data;
    if (Array.isArray(dataB)) return dataB as TransistorEpisode[];
  }
  if (Array.isArray(payload)) return payload as TransistorEpisode[];
  return [];
};

/** Some Transistor responses wrap each episode as { id, type, attributes: {...} }. Flatten that. */
const flattenEpisode = (raw: any): TransistorEpisode => {
  if (raw && typeof raw === "object" && "attributes" in raw) {
    const attrs = raw.attributes ?? {};
    return { id: raw.id, ...attrs };
  }
  return raw as TransistorEpisode;
};

export const useTransistorPodcasts = () => {
  const [data, setData] = useState<TransistorEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = extractEpisodes(json).map(flattenEpisode).filter((e) => e && e.media_url);
        if (!cancelled) setData(list);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
};
