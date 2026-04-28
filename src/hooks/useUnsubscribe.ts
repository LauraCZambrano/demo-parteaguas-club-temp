import { useState } from "react";

const UNSUBSCRIBE_WEBHOOK = "https://ericdacodes.app.n8n.cloud/webhook-test/unsubscribe-parteaguas";

export type UnsubscribeStatus = "idle" | "loading" | "success" | "error";

interface UnsubscribePayload {
  token?: string | null;
  email?: string | null;
}

export const useUnsubscribe = () => {
  const [status, setStatus] = useState<UnsubscribeStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const unsubscribe = async ({ token, email }: UnsubscribePayload) => {
    if (!token && !email) {
      setStatus("error");
      setErrorMessage("Falta el token o el correo para procesar la baja.");
      return false;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch(UNSUBSCRIBE_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token ?? null,
          email: email ? email.trim().toLowerCase() : null,
          source: "web",
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setStatus("success");
      return true;
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? "No pudimos procesar tu baja. Intenta de nuevo en unos minutos."
          : "Error desconocido."
      );
      return false;
    }
  };

  return { unsubscribe, status, errorMessage };
};
