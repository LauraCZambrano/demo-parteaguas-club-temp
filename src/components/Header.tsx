import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Parteaguas Club" className="h-12 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#columnas" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Columnas
          </a>
          <a href="#podcast" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Podcast
          </a>
          <Button size="sm" className="rounded-full px-6 font-semibold">
            Suscribirse
          </Button>
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
            <a
              href="#columnas"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-muted-foreground"
            >
              Columnas
            </a>
            <a
              href="#podcast"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-muted-foreground"
            >
              Podcast
            </a>
            <Button size="sm" className="w-full rounded-sm font-semibold">
              Suscribirse
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
