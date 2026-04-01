import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    }
  };

  const handleAnchorClick = (hash: string) => {
    if (location.pathname === "/") {
      const el = document.querySelector(hash);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + hash);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({ title: "¡Suscrito!", description: "Te mantendremos informado." });
      setEmail("");
    }
  };

  return (
    <footer className="border-t bg-foreground text-background">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <button onClick={handleLogoClick} className="flex items-center">
              <img src={logo} alt="Parteaguas Club" className="h-16 w-auto invert" />
            </button>
            <p className="mt-3 text-sm leading-relaxed opacity-70">
              Un medio digital para quienes buscan entender el mundo con profundidad, claridad y criterio propio.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider opacity-50">Contenido</h4>
              <ul className="mt-3 space-y-2 text-sm opacity-70">
                <li><a href="#columnas" className="hover:opacity-100">Columnas</a></li>
                <li><a href="#podcast" className="hover:opacity-100">Podcast</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider opacity-50">Legal</h4>
              <ul className="mt-3 space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:opacity-100">Privacidad</a></li>
                <li><a href="#" className="hover:opacity-100">Términos</a></li>
              </ul>
            </div>
          </div>

          {/* Subscribe */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider opacity-50">Newsletter</h4>
            <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
              <Input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-sm border-background/20 bg-background/10 text-background placeholder:text-background/40"
                required
              />
              <Button type="submit" size="sm" className="h-10 shrink-0 rounded-full">
                <ArrowRight size={16} />
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-background/10 pt-6 text-center text-xs opacity-50">
          © {new Date().getFullYear()} Parteaguas Club. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
