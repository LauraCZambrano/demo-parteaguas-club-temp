import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { articles, categories } from "@/data/articles";
import BreakoutCard from "@/components/BreakoutCard";
import iconParteaguas from "@/assets/icon-parteaguas.png";

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

        {/* Breakout card — Idea de la Semana */}
        <div className="mt-10">
          <BreakoutCard title="El arte de pensar en sistemas complejos">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <img src={iconParteaguas} alt="" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Los modelos mentales son la herramienta más poderosa del siglo XXI.</span>
              </li>
              <li className="flex items-start gap-2">
                <img src={iconParteaguas} alt="" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Pensar en redes, no en líneas rectas, es lo que separa a los visionarios.</span>
              </li>
              <li className="flex items-start gap-2">
                <img src={iconParteaguas} alt="" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>La complejidad no se simplifica: se navega con mejores herramientas cognitivas.</span>
              </li>
            </ul>
          </BreakoutCard>
        </div>

        {/* Filter tabs */}
        <div className="mt-12 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-sm border px-4 py-1.5 text-sm font-medium transition-colors ${
                active === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles grid */}
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article, i) => (
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
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-block rounded-sm bg-tag px-2 py-0.5 text-xs font-medium text-tag-foreground">
                    {article.category}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                    <Clock size={12} />
                    {article.readingTime} min
                  </span>
                </div>
                <h3 className="mt-3 font-editorial text-lg font-bold leading-snug tracking-tight group-hover:underline">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {article.subtitle}
                </p>
                <time className="mt-3 block text-xs text-muted-foreground">{article.date}</time>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ColumnsSection;
