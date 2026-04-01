import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { ColumnRecord } from "@/hooks/useColumns";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ColumnRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await (supabase as any)
        .from("columns")
        .select("*")
        .eq("id", Number(id))
        .single();
      setArticle(data ?? null);
      setLoading(false);
    };
    fetch();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-12 md:py-20">
          <div className="mx-auto max-w-2xl space-y-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-8 h-8 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-64 w-full rounded-sm" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="container flex flex-1 items-center justify-center py-20">
          <div className="text-center">
            <h1 className="font-editorial text-2xl font-bold">Artículo no encontrado</h1>
            <Link to="/" className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft size={16} /> Volver al inicio
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="min-h-screen">
      <div className="fixed left-0 top-0 z-[60] h-0.5 bg-primary transition-all duration-150" style={{ width: `${progress}%` }} />
      <Header />
      <article className="container py-12 md:py-20">
        <div className="mx-auto max-w-2xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft size={16} /> Volver
          </Link>

          <div className="mt-8">
            <span className="inline-block rounded-sm bg-tag px-2.5 py-1 text-xs font-medium text-tag-foreground">
              {article.origen}
            </span>
            <h1 className="mt-4 font-editorial text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              {article.titulo}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {article.sinopsis}
            </p>
            <time className="mt-4 block text-sm text-muted-foreground">{formatDate(article.created_at)}</time>
          </div>

          <div className="mt-10 overflow-hidden rounded-sm">
            <img src={article.img1} alt={article.titulo} width={800} height={512} className="w-full object-cover" />
          </div>

          <div className="prose-article mt-12 whitespace-pre-line text-base leading-relaxed text-foreground">
            {article.columna}
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
