import { useEffect } from "react";
import { Instagram, Youtube, Music2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import iconParteaguas from "@/assets/icon-parteaguas.png";

const XIcon = ({ size = 18, className }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2H21l-6.52 7.45L22 22h-6.797l-4.77-6.231L4.8 22H2.043l6.974-7.97L2 2h6.914l4.31 5.696L18.244 2Zm-2.385 18.4h1.85L7.235 3.5H5.27L15.86 20.4Z" />
  </svg>
);

const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://www.instagram.com/parteaguasclub", Icon: Instagram },
  { name: "X (Twitter)", href: "https://x.com/parteaguasclub", Icon: XIcon },
  { name: "YouTube", href: "https://www.youtube.com/@parteaguasclub", Icon: Youtube },
  { name: "Spotify", href: "https://open.spotify.com/show/parteaguas", Icon: Music2 },
] as const;

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
            <div className="prose-article mt-6 space-y-5 text-base leading-relaxed text-foreground">
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
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${name} de Parteaguas Club`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
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
