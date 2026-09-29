import { useCallback, useEffect, useRef, useState } from "react";
import { listColumns, toColumnRecord } from "@/lib/tarimah";

export interface ColumnRecord {
  id: number;
  id_unico: number;
  slug?: string;
  titulo: string;
  sinopsis: string;
  columna: string;
  img1: string;
  img2: string | null;
  img3: string | null;
  url_podcast: string | null;
  url_transistor: string | null;
  url_instagram: string | null;
  url_pdf: string | null;
  shared_transistor: string | null;
  origen: string;
  status: string;
  created_at: string;
  fuentes: string | null;
  sources?: { title: string; url: string | null; detail: string | null }[] | null;
  category?: string | null;
}

const PAGE_SIZE = 3;

export const useColumns = (category?: string) => {
  const [data, setData] = useState<ColumnRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredSlug, setFeaturedSlug] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listColumns(1, PAGE_SIZE, category);
      if (!mountedRef.current) return;
      setData(res.items.map(toColumnRecord));
      setPage(res.page);
      setTotal(res.total);
      setCategories(res.categories ?? []);
      setFeaturedSlug(res.featuredSlug ?? null);
    } catch (e: any) {
      if (mountedRef.current) setError(e?.message ?? "Error al cargar contenido");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => {
      mountedRef.current = false;
    };
  }, [load]);

  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    try {
      const res = await listColumns(page + 1, PAGE_SIZE, category);
      if (!mountedRef.current) return;
      setData((prev) => [...prev, ...res.items.map(toColumnRecord)]);
      setPage(res.page);
      setTotal(res.total);
    } catch (e: any) {
      if (mountedRef.current) setError(e?.message ?? "Error al cargar contenido");
    } finally {
      if (mountedRef.current) setLoadingMore(false);
    }
  }, [page, category]);

  return {
    data,
    loading,
    loadingMore,
    error,
    hasMore: data.length < total,
    loadMore,
    retry: load,
    categories,
    featuredSlug,
    total,
  };
};
