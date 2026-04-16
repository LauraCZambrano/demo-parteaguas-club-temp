import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import iconParteaguas from "@/assets/icon-parteaguas.png";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Acerca de | Parteaguas Club";
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

          {/* ¿Qué es Parteaguas? */}
          <section className="mt-16">
            <h2 className="font-editorial text-2xl font-bold tracking-tight md:text-3xl">
              ¿Qué es Parteaguas?
            </h2>
            <div className="prose-article mt-6 space-y-5 text-base leading-relaxed text-foreground">
              <p>
                {/* TODO: Reemplazar con la descripción oficial de Parteaguas */}
                Parteaguas es un espacio editorial donde la noticia se convierte en
                contexto. Aquí no buscamos sumarnos al ruido del día, sino darte las
                herramientas para entender por qué las cosas están pasando como
                están pasando.
              </p>
              <p>
                A través de columnas editoriales, podcast y resúmenes en audio,
                conectamos los hechos con sus causas, sus implicaciones y lo que
                significan para tu vida personal, profesional y financiera.
              </p>
            </div>
          </section>

          {/* ¿Quién es Jonathan Ruiz? */}
          <section className="mt-16">
            <h2 className="font-editorial text-2xl font-bold tracking-tight md:text-3xl">
              ¿Quién es Jonathan Ruiz?
            </h2>
            <div className="prose-article mt-6 space-y-5 text-base leading-relaxed text-foreground">
              <p>
                {/* TODO: Reemplazar con la biografía real de Jonathan Ruiz */}
                Jonathan Ruiz es periodista, analista y la voz detrás de Parteaguas
                Club. Con años de trayectoria cubriendo temas de tecnología,
                economía y sociedad, su trabajo se enfoca en traducir la
                complejidad en ideas claras y accionables.
              </p>
              <p>
                Cada columna y cada episodio del podcast nacen de una convicción:
                las audiencias merecen análisis honesto, sin clickbait y con la
                profundidad necesaria para realmente entender el momento que
                vivimos.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
