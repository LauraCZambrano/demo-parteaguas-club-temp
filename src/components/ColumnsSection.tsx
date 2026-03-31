import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { articles, categories } from "@/data/articles";

const ColumnsSection = () => {
  const [active, setActive] = useState("Todos");

  const filtered = active === "Todos" ? articles : articles.filter((a) => a.category === active);
  const [featured, ...rest] = filtered;

  return (
    <section id="columnas" className="py-16 md:py-24">
      <div className="container">
        {/* Section divider */}
        <div className="mb-10 h-px w-full bg-border" />

        <h2 className="font-editorial text-3xl font-bold tracking-tight md:text-4xl">
          Columnas editoriales
        </h2>
        <p className="mt-2 text-muted-foreground">Análisis profundo sobre lo que importa.</p>

        {/* Filter tabs — minimal underline style */}
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

        {/* Featured Post — full width split */}
        {featured && (
          <Link
            to={`/articulo/${featured.id}`}
            className="group mt-10 grid gap-0 overflow-hidden border bg-card transition-shadow hover:shadow-lg md:grid-cols-2"
          >
            <div className="aspect-[16/10] overflow-hidden md:aspect-auto">
              <img
                src={featured.image}
                alt={featured.title}
                loading="lazy"
                width={800}
                height={512}
                className="h-full w-full object-cover transition-all duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-10">
              <div className="flex items-center gap-3">
                <span className="inline-block rounded-full bg-tag px-3 py-0.5 text-xs font-medium text-tag-foreground">
                  {featured.category}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                  <Clock size={12} />
                  {featured.readingTime} min
                </span>
              </div>
              <h3 className="mt-4 font-editorial text-2xl font-extrabold leading-tight tracking-tight md:text-3xl lg:text-4xl group-hover:underline">
                {featured.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {featured.subtitle}
              </p>
              <time className="mt-3 block font-mono text-[11px] text-muted-foreground">
                {featured.date}
              </time>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-foreground group-hover:gap-2.5 transition-all">
                Leer columna <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        )}

        {/* Secondary grid — 3 columns */}
        {rest.length > 0 && (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article, i) => (
              <Link
                key={article.id}
                to={`/articulo/${article.id}`}
                className="group animate-fade-in-up border bg-card transition-shadow hover:shadow-lg"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    width={800}
                    height={512}
                    className="h-full w-full object-cover transition-all duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-block rounded-full bg-tag px-3 py-0.5 text-xs font-medium text-tag-foreground">
                      {article.category}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                      <Clock size={12} />
                      {article.readingTime} min
                    </span>
                  </div>
                  <h3 className="mt-3 font-editorial text-base font-bold leading-snug tracking-tight group-hover:underline">
                    {article.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {article.subtitle}
                  </p>
                  <time className="mt-3 block font-mono text-[11px] text-muted-foreground">
                    {article.date}
                  </time>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:gap-2 transition-all">
                    Leer columna <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ColumnsSection;
