import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const UNSUBSCRIBE_WEBHOOK = "https://ericdacodes.app.n8n.cloud/webhook/unsubscribe-parteaguas";
const CONFIRMATION_TIMEOUT_MS = 20000;
const REALTIME_READY_TIMEOUT_MS = 8000;

export type UnsubscribeStatus = "idle" | "loading" | "success" | "error";

interface UnsubscribePayload {
  token?: string | null;
  email?: string | null;
}

export const useUnsubscribe = () => {
  const [status, setStatus] = useState<UnsubscribeStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const statusRef = useRef<UnsubscribeStatus>("idle");
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateStatus = (next: UnsubscribeStatus) => {
    statusRef.current = next;
    setStatus(next);
  };

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

  const waitForRealtimeReady = (channel: ReturnType<typeof supabase.channel>) =>
    new Promise<void>((resolve, reject) => {
      const readyTimeout = setTimeout(() => {
        reject(new Error("Realtime subscription timed out"));
      }, REALTIME_READY_TIMEOUT_MS);

      channel.subscribe((subscriptionStatus, err) => {
        if (subscriptionStatus === "SUBSCRIBED") {
          clearTimeout(readyTimeout);
          resolve();
        }

        if (
          subscriptionStatus === "CHANNEL_ERROR" ||
          subscriptionStatus === "TIMED_OUT" ||
          subscriptionStatus === "CLOSED"
        ) {
          clearTimeout(readyTimeout);
          reject(err ?? new Error(`Realtime ${subscriptionStatus}`));
        }
      });
    });

  const unsubscribe = async ({ token, email }: UnsubscribePayload) => {
    if (!token && !email) {
      updateStatus("error");
      setErrorMessage("Falta el token o el correo para procesar la baja.");
      return false;
    }

    cleanup();
    updateStatus("loading");
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
      updateStatus("success");
      cleanup();
    };

    // Escuchamos todos los UPDATE y filtramos en cliente para evitar que
    // caracteres del email rompan el filtro remoto de Realtime.
    channel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "subscribers" },
      handleUpdate
    );

    channelRef.current = channel;
    try {
      await waitForRealtimeReady(channel);
    } catch {
      cleanup();
      updateStatus("error");
      setErrorMessage(
        "No pudimos conectar con la confirmación en tiempo real. Intenta de nuevo en unos minutos."
      );
      return false;
    }

    // 2) Timeout de seguridad: si la BD no confirma, marcamos error.
    timeoutRef.current = setTimeout(() => {
      if (statusRef.current === "success") return;
      setErrorMessage(
        "No recibimos confirmación de la baja. Intenta de nuevo en unos minutos."
      );
      updateStatus("error");
      cleanup();
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
      updateStatus("error");
      setErrorMessage(
        "No pudimos procesar tu baja. Intenta de nuevo en unos minutos."
      );
      return false;
    }
  };

  return { unsubscribe, status, errorMessage };
};
