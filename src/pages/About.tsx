import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialLinks from "@/components/SocialLinks";
import { useBrand } from "@/hooks/useBrand";
import { applySeo } from "@/lib/seo";
import { Helmet } from "react-helmet-async";

/**
 * Demo copy: "Acerca de" is built from the owner's Tarimah profile (Diseño y
 * contenido → Acerca de) — nothing about Parteaguas or its founder is left.
 * Every block renders only when the owner filled it in.
 */
const About = () => {
  const { name, logo, profile, socials } = useBrand();
  const headline = profile?.aboutHeadline ?? profile?.headline ?? null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    applySeo({
      title: `Acerca de ${name}`,
      description: profile?.bio ?? `Acerca de ${name}`,
      url: `${window.location.origin}/acerca`,
      type: "website",
      siteName: name,
    });
  }, [name, profile?.bio]);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{`Acerca de — ${name}`}</title>
        <link rel="canonical" href={`${window.location.origin}/acerca`} />
      </Helmet>
      <Header />
      <main className="container py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          {logo && <img src={logo} alt={name} className="mb-8 h-20 w-20 object-contain md:h-24 md:w-24" />}
          <h1 className="font-editorial text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Acerca de {name}
          </h1>
          {headline && <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{headline}</p>}
          {profile?.bio && (
            <div className="prose-article mt-10 text-base leading-relaxed text-foreground">
              <p>{profile.bio}</p>
            </div>
          )}

          {(profile?.authorName || profile?.authorBio) && (
            <section className="mt-16">
              <h2 className="font-editorial text-2xl font-bold tracking-tight md:text-3xl">
                {profile.authorName ? `¿Quién es ${profile.authorName}?` : "Quién escribe"}
              </h2>
              <div className="mt-8 grid gap-8 md:grid-cols-[200px_1fr] md:items-start md:gap-10">
                {profile.authorPhoto && (
                  <figure className="mx-auto w-40 sm:w-48 md:mx-0 md:w-[200px]">
                    <div className="aspect-square overflow-hidden rounded-sm border border-border bg-secondary/40">
                      <img
                        src={profile.authorPhoto}
                        alt={`Retrato de ${profile.authorName ?? name}`}
                        className="h-full w-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>
                  </figure>
                )}
                {profile.authorBio && (
                  <div className="prose-article text-base leading-relaxed text-foreground">
                    <p>{profile.authorBio}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {profile?.contactEmail && (
            <p className="mt-12 text-sm text-muted-foreground">
              Contacto:{" "}
              <a href={`mailto:${profile.contactEmail}`} className="font-medium text-foreground underline">
                {profile.contactEmail}
              </a>
            </p>
          )}

          {socials.length > 0 && (
            <div className="pt-10">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Sigue a {name}</p>
              <SocialLinks className="mt-3" />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
