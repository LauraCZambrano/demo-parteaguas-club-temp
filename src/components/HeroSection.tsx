import iconParteaguas from "@/assets/icon-parteaguas.png";

const HeroSection = () => {
  return (
    <section className="border-b">
      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <img src={iconParteaguas} alt="Parteaguas" className="mx-auto mb-6 h-24 w-24 md:h-28 md:w-28" />
          <h1 className="font-editorial text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl">
            Aquí te explicamos las{" "}
            <span className="relative inline-block">
              noticias
              <span className="absolute -bottom-1 left-0 h-3 w-full bg-primary/30" />
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl">
            Contexto diario sobre temas que definen tu nueva realidad.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
