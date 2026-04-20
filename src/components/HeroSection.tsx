import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubscribe } from "@/hooks/useSubscribe";
import iconParteaguas from "@/assets/icon-parteaguas.png";

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const { subscribe, loading } = useSubscribe();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      const success = await subscribe(email);
      if (success) setEmail("");
    }
  };

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
          <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-md gap-2">
            <Input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-sm border"
              required
            />
            <Button type="submit" className="h-11 shrink-0 gap-2 rounded-full px-6 font-semibold" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Unirse <ArrowRight size={16} /></>}
            </Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            Gratis. Sin spam. Cancela cuando quieras.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
