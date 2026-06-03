import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SourcesSection from "@/components/SourcesSection";
import InlineAudioPlayer from "@/components/InlineAudioPlayer";
import SocialLinks from "@/components/SocialLinks";
import AdSlot from "@/components/AdSlot";
import { normalizeColumnText } from "@/lib/normalizeText";
import { supabase } from "@/integrations/supabase/client";
import type { ColumnRecord } from "@/hooks/useColumns";
import { slugify } from "@/lib/slugify";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAudio } from "@/contexts/AudioContext";
import { useArticleAds } from "@/hooks/useArticleAds";
import type { PodcastEpisode } from "@/data/articles";
import { applySeo } from "@/lib/seo";
import { Helmet } from "react-helmet-async";

const columnToEpisode = (col: ColumnRecord): PodcastEpisode => ({
  id: String(col.id),
  title: col.titulo,
  description: col.sinopsis,
  duration: "",
  date: new Date(col.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }),
  image: col.img1,
  audioUrl: col.url_transistor || col.url_podcast || undefined,
  plays: 0,
  columnId: col.id,
  columnText: col.columna || undefined,
});

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ColumnRecord | null>(null);
  const [nextArticle, setNextArticle] = useState<ColumnRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { episode: activeEpisode, close } = useAudio();
  const { ads } = useArticleAds(article?.id ?? null);
  const articleSlug = article ? slugify(article.titulo) : "";
  const articleCategory = article?.category ?? "";

  // Stop audio when leaving the article page if the playing episode belongs to this article
  useEffect(() => {
    return () => {
      if (article && activeEpisode?.id === String(article.id)) {
        close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.id, activeEpisode?.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      // Fetch all published columns and match by slug
      const { data: allCols } = await (supabase as any)
        .from("columns")
        .select("*")
        .eq("web_published", true);
      const matched = (allCols ?? []).find(
        (c: ColumnRecord) => slugify(c.titulo) === slug
      );
      const data = matched ?? null;
      setArticle(data ?? null);

      if (data) {
        const { data: next } = await (supabase as any)
          .from("columns")
          .select("*")
          .eq("web_published", true)
          .lt("created_at", data.created_at)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        setNextArticle(next ?? null);
      }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!article) return;
    const truncate = (s: string, n: number) =>
      s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s;
    const siteSuffix = " | Parteaguas";
    const rawSinopsis = (article.sinopsis ?? "").replace(/\s+/g, " ").trim();
    const description = rawSinopsis.length + siteSuffix.length <= 160
      ? `${rawSinopsis}${siteSuffix}`
      : truncate(rawSinopsis, 160 - siteSuffix.length) + siteSuffix;
    const suffix = " | Parteaguas Club";
    const baseTitle = article.titulo.trim();
    const title = baseTitle.length + suffix.length <= 60
      ? `${baseTitle}${suffix}`
      : truncate(baseTitle, 60 - suffix.length) + suffix;
    applySeo({
      title,
      description,
      image: article.img1,
      url: `${window.location.origin}/articulo/${slugify(article.titulo)}`,
      type: "article",
    });
  }, [article]);

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
      <Helmet>
        <title>{`${article.titulo} — Parteaguas Club`}</title>
        <meta name="description" content={article.sinopsis ?? ""} />
        <link rel="canonical" href={`https://www.parteaguas.club/articulo/${slugify(article.titulo)}`} />
        <meta property="og:title" content={article.titulo} />
        <meta property="og:description" content={article.sinopsis ?? ""} />
        <meta property="og:url" content={`https://www.parteaguas.club/articulo/${slugify(article.titulo)}`} />
        <meta property="og:type" content="article" />
        {article.img1 && <meta property="og:image" content={article.img1} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: article.titulo,
            description: article.sinopsis,
            image: article.img1 ? { "@type": "ImageObject", url: article.img1 } : undefined,
            datePublished: article.created_at,
            author: {
              "@type": "Organization",
              name: "Parteaguas Club",
            },
            url: `https://www.parteaguas.club/articulo/${slugify(article.titulo)}`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.parteaguas.club/articulo/${slugify(article.titulo)}`,
            },
            publisher: {
              "@type": "Organization",
              name: "Parteaguas Club",
              "@id": "https://www.parteaguas.club/#organization",
            },
          })}
        </script>
      </Helmet>
      <div className="fixed left-0 top-0 z-[60] h-0.5 bg-primary transition-all duration-150" style={{ width: `${progress}%` }} />
      <Header />
      <article className="container py-12 md:py-20">
        <div className="mx-auto max-w-2xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft size={16} /> Volver
          </Link>

          <div className="mt-8">
            <h1 className="font-editorial text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              {article.titulo}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {article.sinopsis}
            </p>
            <div className="mt-4">
              <time className="text-sm text-muted-foreground">{formatDate(article.created_at)}</time>
            </div>
            {(article.url_transistor || article.url_podcast) && (
              <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-5 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Escucha el resumen de la noticia
                </p>
                <div className="mt-4">
                  <InlineAudioPlayer episode={columnToEpisode(article)} label={article.titulo} />
                </div>
              </div>
            )}

            {/* Zona A: después del reproductor de audio */}
            <AdSlot zone="A" ads={ads.A} articleSlug={articleSlug} articleCategory={articleCategory} className="my-8" />
          </div>

          <div className="mt-10 overflow-hidden rounded-sm">
            <img
              src={article.img1}
              srcSet={`${article.img1}?width=400 400w, ${article.img1}?width=800 800w, ${article.img1}?width=1200 1200w`}
              sizes="(max-width: 640px) 100vw, 80vw"
              alt={`Portada de la columna: ${article.titulo}`}
              title={article.titulo}
              width={800}
              height={512}
              loading="lazy"
              className="w-full object-cover"
            />
          </div>

          {(() => {
            const paragraphs = normalizeColumnText(article.columna);
            const total = paragraphs.length;
            const insertImg2 = article.img2 ? Math.floor(total / 3) : -1;
            const insertImg3 = article.img3 ? Math.floor((total * 2) / 3) : -1;

            return (
              <div className="prose-article mt-12 text-base leading-relaxed text-foreground space-y-6">
                {paragraphs.map((p, i) => (
                  <div key={i}>
                    <p>{p}</p>
                    {/* Zona B: después del tercer párrafo */}
                    {i === 2 && <AdSlot zone="B" ads={ads.B} articleSlug={articleSlug} articleCategory={articleCategory} className="my-8" />}
                    {i === insertImg2 && (
                      <div className="my-8 overflow-hidden rounded-sm">
                        <img src={article.img2!} alt={`${article.titulo} – imagen complementaria 2`} title={article.titulo} width={800} height={512} className="w-full object-cover" />
                      </div>
                    )}
                    {i === insertImg3 && (
                      <div className="my-8 overflow-hidden rounded-sm">
                        <img src={article.img3!} alt={`${article.titulo} – imagen complementaria 3`} title={article.titulo} width={800} height={512} className="w-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Zona C: al finalizar el texto, antes de fuentes */}
          <AdSlot zone="C" ads={ads.C} articleSlug={articleSlug} articleCategory={articleCategory} className="my-8" />

          {article.fuentes && <SourcesSection fuentes={article.fuentes} />}

          {/* Sigue a Parteaguas */}
          <div className="mt-12 rounded-2xl border border-border bg-muted/40 p-6 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              ¿Te gustó esta columna?
            </p>
            <h3 className="mt-1 font-editorial text-lg font-semibold text-foreground">
              Sigue a Parteaguas en redes
            </h3>
            <SocialLinks className="mt-4 justify-center" />
          </div>

          {/* Siguiente nota */}
          {nextArticle && (
            <Link
              to={`/articulo/${slugify(nextArticle.titulo)}`}
              className="group mt-16 block rounded-lg border border-border bg-card p-6 transition-colors hover:border-foreground/30"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Siguiente nota</span>
              <div className="mt-4 flex items-start gap-5">
                <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-sm">
                  <img
                    src={nextArticle.img1}
                    alt={`Portada de la columna: ${nextArticle.titulo}`}
                    title={nextArticle.titulo}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-editorial text-lg font-bold leading-snug tracking-tight group-hover:text-foreground transition-colors">
                    {nextArticle.titulo}
                  </h3>
                </div>
                <ArrowRight size={20} className="mt-1 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
              </div>
            </Link>
          )}
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
