import { useBrand } from "@/hooks/useBrand";

const HeroSection = () => {
  const { name, logo, profile } = useBrand();
  return (
    <section className="border-b">
      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          {logo && <img src={logo} alt={name} className="mx-auto mb-6 h-24 w-24 object-contain md:h-28 md:w-28" />}
          <h1 className="font-editorial text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl">
            {profile?.headline ?? name}
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl">
            {profile?.bio ?? "Columnas, imágenes y podcast publicados desde Tarimah."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
