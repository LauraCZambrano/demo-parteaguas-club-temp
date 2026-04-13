import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ColumnRecord {
  id: number;
  id_unico: number;
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
}

export const useColumns = () => {
  const [data, setData] = useState<ColumnRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const fetchColumns = async () => {
      try {
        const { data: rows, error: err } = await (supabase as any)
          .from("columns")
          .select("*")
          .eq("web_published", true)
          .order("created_at", { ascending: false });

        if (err) throw err;
        if (mountedRef.current) setData(rows ?? []);
      } catch (e: any) {
        if (mountedRef.current) setError(e.message ?? "Error al cargar contenido");
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchColumns();

    const channel = supabase
      .channel("columns-realtime")
      .on(
        "postgres_changes" as any,
        { event: "*", schema: "public", table: "columns" },
        () => fetchColumns()
      )
      .subscribe();

    return () => {
      mountedRef.current = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { data, loading, error };
};
