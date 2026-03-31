import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { articles } from "@/data/articles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const article = articles.find((a) => a.id === id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <div className="min-h-screen">
      {/* Reading progress bar */}
      <div className="fixed left-0 top-0 z-[60] h-0.5 bg-primary transition-all duration-150" style={{ width: `${progress}%` }} />

      <Header />
      <article className="container py-12 md:py-20">
        <div className="mx-auto max-w-2xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft size={16} /> Volver
          </Link>

          <div className="mt-8">
            <span className="inline-block rounded-sm bg-tag px-2.5 py-1 text-xs font-medium text-tag-foreground">
              {article.category}
            </span>
            <h1 className="mt-4 font-editorial text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              {article.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {article.subtitle}
            </p>
            <time className="mt-4 block text-sm text-muted-foreground">{article.date}</time>
          </div>

          <div className="mt-10 overflow-hidden rounded-sm">
            <img
              src={article.image}
              alt={article.title}
              width={800}
              height={512}
              className="w-full object-cover"
            />
          </div>

          <div
            className="prose-article mt-12"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
