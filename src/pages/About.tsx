import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialLinks from "@/components/SocialLinks";
import iconParteaguas from "@/assets/icon-parteaguas.png";
import jonathanPortrait from "@/assets/jonathan-portrait.png";

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
              <p>
                La columna Parteaguas nace en 2014 dedicada a los negocios
                disruptivos y tecnológicos, con réplica diaria en el podcast{" "}
                <em>Parteaguas Diario</em> y presencia activa en redes sociales como{" "}
                <span className="font-medium text-foreground">@parteaguasclub</span>.
              </p>
            </div>
          </section>

          {/* ¿Quién es Jonathan Ruiz? */}
          <section className="mt-16">
            <h2 className="font-editorial text-2xl font-bold tracking-tight md:text-3xl">
              ¿Quién es Jonathan Ruiz?
            </h2>

            {/* Editorial portrait + bio layout */}
            <div className="mt-8 grid gap-8 md:grid-cols-[200px_1fr] md:items-start md:gap-10">
              <figure className="mx-auto w-40 sm:w-48 md:mx-0 md:w-[200px]">
                <div className="overflow-hidden rounded-sm border border-border bg-secondary/40 aspect-square">
                  <img
                    src={jonathanPortrait}
                    alt="Retrato de Jonathan Ruiz, fundador de Parteaguas Club"
                    className="h-full w-full object-cover object-top grayscale-[15%]"
                    loading="lazy"
                  />
                </div>
                <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground md:text-left">
                  Jonathan Ruiz · Fundador
                </figcaption>
              </figure>

              <div className="prose-article space-y-5 text-base leading-relaxed text-foreground">
                <p>
                  Jonathan Ruiz es comunicólogo egresado de la Universidad Autónoma
                  de Nuevo León (UANL), con estudios especializados sobre Mercados
                  de Petróleo, Gas y Energía en la Universidad de Houston.
                </p>
                <p>
                  A lo largo de su carrera ha sido reportero y editor de información
                  de Negocios en <em>Milenio</em>, <em>El Norte</em> y{" "}
                  <em>Reforma</em>, donde fundó la columna institucional{" "}
                  <em>Capitanes</em>. Posteriormente fue Director General de
                  Información Económica en <em>El Financiero</em> y fundador de la
                  revista <em>Bloomberg Businessweek México</em>.
                </p>
                <p>
                  Como Director General de Proyectos Especiales de{" "}
                  <em>El Financiero</em>, encabezó los esfuerzos de contenidos
                  digitales de la organización. Desde 2014 escribe su columna{" "}
                  <em>Parteaguas</em>, dedicada a los negocios disruptivos y
                  tecnológicos, con réplica en el podcast{" "}
                  <em>Parteaguas Diario</em> y en redes sociales como{" "}
                  <span className="font-medium text-foreground">@parteaguasclub</span>.
                </p>

                <div className="pt-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Sigue a Parteaguas
                  </p>
                  <SocialLinks className="mt-3" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
