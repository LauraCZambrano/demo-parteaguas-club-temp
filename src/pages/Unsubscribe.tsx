import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Loader2, CheckCircle2, AlertCircle, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUnsubscribe } from "@/hooks/useUnsubscribe";
import { applySeo } from "@/lib/seo";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get("token");
  const emailParam = searchParams.get("email");

  const { unsubscribe, status, errorMessage } = useUnsubscribe();
  const [email, setEmail] = useState(emailParam ?? "");
  const [autoTried, setAutoTried] = useState(false);

  // Si llega con token en la URL, procesar automáticamente.
  useEffect(() => {
    if (tokenParam && !autoTried) {
      setAutoTried(true);
      void unsubscribe({ token: tokenParam });
    }
  }, [tokenParam, autoTried, unsubscribe]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    void unsubscribe({ email });
  };

  const isProcessingToken = tokenParam && (status === "loading" || (status === "idle" && !autoTried));

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container max-w-2xl py-20">
        <div className="rounded-3xl border border-foreground/10 bg-background p-8 sm:p-12">
          {/* Estado: procesando token automático */}
          {isProcessingToken && (
            <div className="flex flex-col items-center text-center">
              <Loader2 size={36} className="animate-spin text-foreground/60" />
              <h1 className="mt-6 font-serif text-3xl">Procesando tu baja…</h1>
              <p className="mt-2 text-sm text-foreground/60">Un momento por favor.</p>
            </div>
          )}

          {/* Estado: éxito */}
          {status === "success" && (
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 size={44} className="text-foreground" />
              <h1 className="mt-6 font-serif text-3xl">Listo, te has desuscrito</h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/60">
                Ya no recibirás más correos del newsletter. Si fue un error, siempre puedes volver a suscribirte desde la página principal.
              </p>
              <Link to="/" className="mt-8">
                <Button className="h-11 rounded-full px-6 font-semibold">Volver al inicio</Button>
              </Link>
            </div>
          )}

          {/* Estado: error con token automático */}
          {status === "error" && tokenParam && (
            <div className="flex flex-col items-center text-center">
              <AlertCircle size={44} className="text-foreground" />
              <h1 className="mt-6 font-serif text-3xl">No pudimos completar la baja</h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/60">
                {errorMessage ?? "Intenta de nuevo o usa el formulario para escribir tu correo."}
              </p>
            </div>
          )}

          {/* Formulario manual: si NO hay token, o si el token falló */}
          {(!tokenParam || status === "error") && status !== "success" && (
            <div>
              {!tokenParam && status === "idle" && (
                <div className="text-center">
                  <Mail size={36} className="mx-auto text-foreground/60" />
                  <h1 className="mt-6 font-serif text-3xl">Desuscribirse del newsletter</h1>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/60">
                    Escribe el correo que ya no quieres ver en tu bandeja. Te quitaremos de la lista enseguida.
                  </p>
                </div>
              )}

              <form onSubmit={handleManualSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 flex-1 rounded-full px-4"
                  required
                />
                <Button
                  type="submit"
                  className="h-11 rounded-full px-6 font-semibold"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : "Desuscribirme"}
                </Button>
              </form>

              {status === "error" && !tokenParam && errorMessage && (
                <p className="mt-4 text-center text-sm text-destructive">{errorMessage}</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Unsubscribe;
