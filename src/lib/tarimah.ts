import type { ColumnRecord } from "@/hooks/useColumns";

const BASE =
  (import.meta.env.VITE_TARIMAH_API_BASE as string | undefined) ??
  "https://d23smvfp69svek.cloudfront.net/api/tarimah";
const HANDLE = (import.meta.env.VITE_TARIMAH_SITE_HANDLE as string | undefined) ?? "parteaguas";

const TTL = 60_000;
const cache = new Map<string, { at: number; value: Promise<unknown> }>();

export class NotFoundError extends Error {}

interface Envelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const unwrap = <T>(body: Envelope<T>): T => {
  if (!body || body.success === false) throw new Error(body?.message || "Error en la API");
  return body.data;
};

const get = <T>(path: string): Promise<T> => {
  const url = `${BASE}${path}`;
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < TTL) return hit.value as Promise<T>;
  const value = fetch(url).then(async (res) => {
    if (res.status === 404) throw new NotFoundError("No encontrado");
    const body = await res.json().catch(() => null);
    if (!res.ok && !body) throw new Error(`Error ${res.status}`);
    return unwrap<T>(body);
  });
  value.catch(() => cache.delete(url));
  cache.set(url, { at: Date.now(), value });
  return value;
};

export interface ApiColumn {
  title: string | null;
  seoSynopsis: string | null;
  body?: string | null;
  category: string | null;
  slug: string | null;
  img1: string | null;
  img2: string | null;
  img3: string | null;
  urlPodcast: string | null;
  publishedAt: string | null;
}

export interface ColumnsPage {
  items: ApiColumn[];
  total: number;
  page: number;
  limit: number;
  categories: string[];
  featuredSlug: string | null;
  totalEpisodes?: number;
  sinceYear?: number;
}

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export const toColumnRecord = (c: ApiColumn): ColumnRecord => ({
  id: hash(c.slug ?? c.title ?? ""),
  id_unico: 0,
  slug: c.slug ?? undefined,
  titulo: c.title ?? "",
  sinopsis: c.seoSynopsis ?? "",
  columna: c.body ?? "",
  img1: c.img1 ?? "",
  img2: c.img2,
  img3: c.img3,
  url_podcast: c.urlPodcast,
  url_transistor: null,
  url_instagram: null,
  url_pdf: null,
  shared_transistor: null,
  origen: "",
  status: "",
  created_at: c.publishedAt ?? "",
  fuentes: null,
  category: c.category,
});

export const listColumns = (page = 1, limit = 10, category?: string) => {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (category) q.set("category", category);
  return get<ColumnsPage>(`/sites/${HANDLE}/columns?${q.toString()}`);
};

export const getColumn = (slug: string) =>
  get<ApiColumn>(`/sites/${HANDLE}/columns/${encodeURIComponent(slug)}`);

export const getSite = () => get<Record<string, unknown>>(`/sites/${HANDLE}`);
