import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ColumnRecord } from "@/hooks/useColumns";

const ITEMS_PER_PAGE = 3;

interface ColumnsSectionProps {
  columns: ColumnRecord[];
  loading: boolean;
  error: string | null;
}

const ColumnsSection = ({ columns, loading, error }: ColumnsSectionProps) => {
  const [active, setActive] = useState("Todos");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);

  const categories = useMemo(() => {
    const origins = Array.from(new Set(columns.map((c) => c.origen)));
    return ["Todos", ...origins];
  }, [columns]);

  const filtered = active === "Todos" ? columns : columns.filter((c) => c.origen === active);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      setLoadingMore(false);
    }, 600);
  }, []);

  const handleFilterChange = (cat: string) => {
    setActive(cat);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <section id="columnas" className="py-16 md:py-24">
      <div className="container">
        <h2 className="font-editorial text-3xl font-bold tracking-tight md:text-4xl">
          Columnas editoriales
        </h2>
        <p className="mt-2 text-muted-foreground">Análisis profundo sobre lo que importa.</p>

        {/* Error state */}
        {error && (
          <p className="mt-8 text-center text-sm text-destructive">
            Error al cargar contenido, intenta refrescar.
          </p>
        )}

        {/* Loading skeletons */}
        {loading && (
          <>
            <div className="mt-12 flex gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-20 rounded-full" />
              ))}
            </div>
            <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col rounded-lg border border-border overflow-hidden">
                  <Skeleton className="w-full" style={{ aspectRatio: "3/2" }} />
                  <div className="flex flex-col gap-3 p-5">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="mt-4 h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Filter tabs */}
            <div className="mt-12 flex flex-wrap gap-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange(cat)}
                  className={`relative pb-2 text-sm font-medium transition-colors ${
                    active === cat
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                  {active === cat && (
                    <span className="absolute inset-x-0 bottom-0 h-[3px] bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((col, i) => (
                <Link
                  key={col.id}
                  to={`/articulo/${col.id}`}
                  className="group flex flex-col animate-fade-in-up rounded-lg border border-border overflow-hidden"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "3/2" }}>
                    <img
                      src={col.img1}
                      alt={col.titulo}
                      loading="lazy"
                      className="block h-full w-full object-cover transition-all duration-300 group-hover:brightness-105"
                    />
                    {i === 0 && active === "Todos" && (
                      <span className="absolute top-3 left-3 rounded-sm bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                        Nuevo
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
                    <span className="mb-2 inline-block w-fit rounded-full bg-tag px-2.5 py-0.5 text-[10px] font-medium text-tag-foreground">
                      {col.origen}
                    </span>

                    <h3 className="font-editorial text-lg font-bold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-muted-foreground">
                      {col.titulo}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {col.sinopsis}
                    </p>

                    <div className="mt-auto pt-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground transition-all group-hover:gap-2.5">
                        Leer columna <ArrowRight size={12} />
                      </span>
                      <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                        <time>{formatDate(col.created_at)}</time>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  variant="outline"
                  className="rounded-full px-6"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    "Ver más columnas"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ColumnsSection;
