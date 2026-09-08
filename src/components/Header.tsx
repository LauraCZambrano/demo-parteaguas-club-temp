import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
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
    setMobileOpen(false);
    if (location.pathname === "/") {
      const el = document.querySelector(hash);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + hash);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <button onClick={handleLogoClick} className="flex items-center">
          <img src={logo} alt="Parteaguas Club" className="h-12 w-auto" />
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <button onClick={() => handleAnchorClick("#analisis")} className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
            Análisis
          </button>
          <button onClick={() => handleAnchorClick("#podcast")} className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
            Podcast
          </button>
          <Link to="/acerca" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
            Acerca de
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleAnchorClick("#analisis")}
              className="text-left text-base font-semibold text-muted-foreground"
            >
              Análisis
            </button>
            <button
              onClick={() => handleAnchorClick("#podcast")}
              className="text-left text-base font-semibold text-muted-foreground"
            >
              Podcast
            </button>
            <Link
              to="/acerca"
              onClick={() => setMobileOpen(false)}
              className="text-left text-base font-semibold text-muted-foreground"
            >
              Acerca de
            </Link>
          </div>
        </nav>
      )}

      
    </header>
  );
};

export default Header;
