import { useNavigate, useLocation } from "react-router-dom";
import SocialLinks from "@/components/SocialLinks";
import BrandLogo from "@/components/BrandLogo";
import { useBrand } from "@/hooks/useBrand";

const Footer = () => {
  const { name } = useBrand();
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

  return (
    <footer className="border-t bg-foreground text-background">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Brand */}
          <div>
            <button onClick={handleLogoClick} className="flex items-center">
              <BrandLogo className="h-16 w-auto rounded-md bg-background p-1" textClassName="font-editorial text-2xl font-bold" />
            </button>
            <p className="mt-3 text-sm leading-relaxed opacity-70">
              Un medio digital para quienes buscan entender el mundo con profundidad, claridad y criterio propio.
            </p>
            <SocialLinks variant="light" size="sm" className="mt-5" />
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider opacity-50">Contenido</h4>
              <ul className="mt-3 space-y-2 text-sm opacity-70">
                <li><button onClick={() => handleAnchorClick("#analisis")} className="hover:opacity-100">Análisis</button></li>
                <li><button onClick={() => handleAnchorClick("#podcast")} className="hover:opacity-100">Podcast</button></li>
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

        </div>

        <div className="mt-12 border-t border-background/10 pt-6 text-center text-xs opacity-50">
          © {new Date().getFullYear()} {name} · Demo de conexión con Tarimah.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
