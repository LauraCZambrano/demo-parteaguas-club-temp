import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const UNSUBSCRIBE_WEBHOOK = "https://ericdacodes.app.n8n.cloud/webhook-test/unsubscribe-parteaguas";
const CONFIRMATION_TIMEOUT_MS = 20000;

export type UnsubscribeStatus = "idle" | "loading" | "success" | "error";

interface UnsubscribePayload {
  token?: string | null;
  email?: string | null;
}

export const useUnsubscribe = () => {
  const [status, setStatus] = useState<UnsubscribeStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => () => cleanup(), []);

  const unsubscribe = async ({ token, email }: UnsubscribePayload) => {
    if (!token && !email) {
      setStatus("error");
      setErrorMessage("Falta el token o el correo para procesar la baja.");
      return false;
    }

    cleanup();
    setStatus("loading");
    setErrorMessage(null);

    const normalizedEmail = email ? email.trim().toLowerCase() : null;

    // 1) Suscribirse a Realtime ANTES de disparar el webhook
    //    para no perder el evento de actualización.
    const channelName = `unsubscribe-${normalizedEmail ?? token}-${Date.now()}`;
    const channel = supabase.channel(channelName);

    const handleUpdate = (payload: any) => {
      const newRow = payload?.new ?? {};
      if (newRow.status !== "unsubscribed") return;
      if (normalizedEmail && newRow.email?.toLowerCase?.() !== normalizedEmail) return;
      // Confirmado por la base de datos.
      setStatus("success");
      cleanup();
    };

    if (normalizedEmail) {
      channel.on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "subscribers",
          filter: `email=eq.${normalizedEmail}`,
        },
        handleUpdate
      );
    } else {
      // Sin email: escuchamos todos los UPDATE y matcheamos por status.
      channel.on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "subscribers" },
        handleUpdate
      );
    }

    channelRef.current = channel;
    channel.subscribe();

    // 2) Timeout de seguridad: si la BD no confirma, marcamos error.
    timeoutRef.current = setTimeout(() => {
      setStatus((prev) => {
        if (prev === "success") return prev;
        setErrorMessage(
          "No recibimos confirmación de la baja. Intenta de nuevo en unos minutos."
        );
        cleanup();
        return "error";
      });
    }, CONFIRMATION_TIMEOUT_MS);

    // 3) Disparar el webhook (no marca éxito por sí solo).
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
      // Esperamos confirmación vía Realtime; no cambiamos status aquí.
      return true;
    } catch {
      cleanup();
      setStatus("error");
      setErrorMessage(
        "No pudimos procesar tu baja. Intenta de nuevo en unos minutos."
      );
      return false;
    }
  };

  return { unsubscribe, status, errorMessage };
};
