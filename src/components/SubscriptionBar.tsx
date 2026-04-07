import { useState, useEffect } from "react";
import { ArrowRight, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSubscribe } from "@/hooks/useSubscribe";

const SubscriptionBar = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("sub_bar_dismissed") === "1");
  const [email, setEmail] = useState("");
  const { subscribe, loading } = useSubscribe();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      const success = await subscribe(email);
      if (success) {
        setEmail("");
        setDismissed(true);
      }
    }
  };

  if (dismissed || !visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] animate-fade-in border-b bg-foreground text-background">
      <div className="container flex items-center justify-between gap-4 py-2.5">
        <p className="hidden text-sm font-medium sm:block">
          Ideas que marcan un antes y un después.{" "}
          <span className="font-semibold">Suscríbete.</span>
        </p>
        <p className="text-sm font-medium sm:hidden">Suscríbete al newsletter</p>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-8 w-40 rounded-sm border-background/20 bg-background/10 text-xs text-background placeholder:text-background/40 sm:w-52"
            required
          />
          <Button type="submit" size="sm" className="h-8 rounded-full px-3 text-xs font-semibold" disabled={loading}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
          </Button>
        </form>

        <button
          onClick={() => { setDismissed(true); sessionStorage.setItem("sub_bar_dismissed", "1"); }}
          className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default SubscriptionBar;
