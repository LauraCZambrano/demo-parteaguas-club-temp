import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import iconParteaguas from "@/assets/icon-parteaguas.png";

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({ title: "¡Bienvenido al club!", description: "Te hemos añadido a la lista." });
      setEmail("");
    }
  };

  return (
    <section className="border-b">
      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <img src={iconParteaguas} alt="Parteaguas" className="mx-auto mb-6 h-24 w-24 md:h-28 md:w-28" />
          <h1 className="font-editorial text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Ideas que{" "}
            <span className="relative inline-block">
              cambian
              <span className="absolute -bottom-1 left-0 h-3 w-full bg-primary/30" />
            </span>{" "}
            la conversación.
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Una lectura diaria sobre los temas que definen nuestra realidad. Sin distracciones, solo las ideas que valen tu tiempo.
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
            <Button type="submit" className="h-11 shrink-0 gap-2 rounded-full px-6 font-semibold">
              Unirse <ArrowRight size={16} />
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
