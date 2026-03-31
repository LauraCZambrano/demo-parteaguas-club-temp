import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { articles, categories } from "@/data/articles";

const ColumnsSection = () => {
  const [active, setActive] = useState("Todos");

  const filtered = active === "Todos" ? articles : articles.filter((a) => a.category === active);

  return (
    <section id="columnas" className="py-16 md:py-24">
      <div className="container">
        {/* Section divider */}
        <div className="mb-10 h-px w-full bg-border" />

        <h2 className="font-editorial text-3xl font-bold tracking-tight md:text-4xl">
          Columnas editoriales
        </h2>
        <p className="mt-2 text-muted-foreground">Análisis profundo sobre lo que importa.</p>

        {/* Filter tabs */}
        <div className="mt-12 flex flex-wrap gap-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
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

        {/* Uniform 3-col grid */}
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article, i) => (
            <Link
              key={article.id}
              to={`/articulo/${article.id}`}
              className="group flex flex-col animate-fade-in-up rounded-lg border border-border overflow-hidden"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/2" }}>
                <img
                  src={article.image}
                  alt={article.title}
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
              <div className="flex flex-1 flex-col p-5">
                {/* Thin rule above title */}
                <div className="mb-3 h-px w-full bg-border/60" />

                <span className="mb-2 inline-block w-fit rounded-full bg-tag px-2.5 py-0.5 text-[10px] font-medium text-tag-foreground">
                  {article.category}
                </span>

                <h3 className="font-editorial text-lg font-bold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-muted-foreground">
                  {article.title}
                </h3>

                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {article.subtitle}
                </p>

                {/* Spacer to push bottom content down */}
                <div className="mt-auto pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground transition-all group-hover:gap-2.5">
                    Leer columna <ArrowRight size={12} />
                  </span>
                  <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                    <time>{article.date}</time>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} />
                      {article.readingTime} min
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ColumnsSection;
