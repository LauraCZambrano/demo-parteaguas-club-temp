import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import iconParteaguas from "@/assets/icon-parteaguas.png";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Acerca | Parteaguas Club";
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <img
            src={iconParteaguas}
            alt="Parteaguas Club"
            className="mb-8 h-20 w-20 md:h-24 md:w-24"
          />
          <h1 className="font-editorial text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Acerca de Parteaguas Club
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Contexto diario sobre los temas que están definiendo tu nueva realidad.
          </p>

          <div className="prose-article mt-12 space-y-6 text-base leading-relaxed text-foreground">
            <p>
              Parteaguas Club nace de una idea simple: las noticias importan, pero el
              contexto importa más. Vivimos rodeados de titulares que aparecen y
              desaparecen en minutos, sin tiempo para entender lo que realmente
              significan.
            </p>
            <p>
              Aquí te explicamos las noticias. Cada columna y cada episodio del
              podcast están pensados para darte el trasfondo que necesitas para
              tomar decisiones más informadas en tu vida personal, profesional y
              financiera.
            </p>

            <h2 className="font-editorial text-2xl font-bold tracking-tight">
              Qué encontrarás aquí
            </h2>
            <ul className="ml-5 list-disc space-y-2">
              <li>Columnas editoriales con análisis a fondo de los temas del día.</li>
              <li>Podcast con la historia detrás de cada nota, en voz de Jonathan.</li>
              <li>Resúmenes en audio para escuchar mientras haces otras cosas.</li>
              <li>Una newsletter directa, sin ruido y sin spam.</li>
            </ul>

            <h2 className="font-editorial text-2xl font-bold tracking-tight">
              Nuestra promesa
            </h2>
            <p>
              Sin clickbait. Sin distracciones. Solo las ideas que valen tu tiempo
              y el contexto que te ayuda a entender por qué las cosas están pasando
              como están pasando.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
