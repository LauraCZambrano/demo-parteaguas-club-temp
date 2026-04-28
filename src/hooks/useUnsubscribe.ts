import { useState } from "react";

const UNSUBSCRIBE_WEBHOOK = "https://ericdacodes.app.n8n.cloud/webhook/unsubscribe-parteaguas";

export type UnsubscribeStatus = "idle" | "loading" | "success" | "error";

interface UnsubscribePayload {
  token?: string | null;
  email?: string | null;
}

interface UnsubscribeWebhookResponse {
  status?: string;
  error?: string;
  message?: string;
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

    const normalizedEmail = email ? email.trim().toLowerCase() : null;

    try {
      const response = await fetch(UNSUBSCRIBE_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token ?? null,
          email: normalizedEmail,
          source: "web",
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = (await response.json()) as UnsubscribeWebhookResponse;

      if (result.status !== "unsubscribed") {
        throw new Error(result.message ?? result.error ?? "Unexpected webhook response");
      }

      setStatus("success");
      return true;
    } catch {
      setStatus("error");
      setErrorMessage(
        "No pudimos procesar tu baja. Intenta de nuevo en unos minutos."
      );
      return false;
    }
  };

  return { unsubscribe, status, errorMessage };
};
