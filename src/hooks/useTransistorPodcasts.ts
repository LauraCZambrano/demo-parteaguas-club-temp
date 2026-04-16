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

  // n8n often wraps the response as an array: [{ data: [...] }]
  if (Array.isArray(payload)) {
    // If it's an array of episodes directly
    const first = payload[0] as Record<string, unknown> | undefined;
    if (first && typeof first === "object" && "data" in first) {
      const inner = (first as Record<string, unknown>).data;
      if (Array.isArray(inner)) return inner as TransistorEpisode[];
    }
    return payload as TransistorEpisode[];
  }

  // Object shapes: { data: [...] } or { data: { data: [...] } }
  const anyP = payload as Record<string, unknown>;
  const dataA = anyP.data;
  if (Array.isArray(dataA)) return dataA as TransistorEpisode[];
  if (dataA && typeof dataA === "object") {
    const dataB = (dataA as Record<string, unknown>).data;
    if (Array.isArray(dataB)) return dataB as TransistorEpisode[];
  }
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
    const controller = new AbortController();
    // Abort the request if it takes more than 20s so the UI can recover.
    const timeoutId = window.setTimeout(() => controller.abort(), 20000);

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = extractEpisodes(json).map(flattenEpisode).filter((e) => e && e.media_url);
        if (!cancelled) setData(list);
      } catch (err) {
        if (!cancelled) {
          const msg =
            err instanceof DOMException && err.name === "AbortError"
              ? "Tiempo de espera agotado"
              : err instanceof Error
                ? err.message
                : "Error desconocido";
          setError(msg);
        }
      } finally {
        window.clearTimeout(timeoutId);
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, []);

  return { data, loading, error };
};
