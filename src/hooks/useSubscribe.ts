import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSubscribe = () => {
  const [loading, setLoading] = useState(false);

  const subscribe = async (email: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .rpc("safe_subscribe", { email_input: email.trim().toLowerCase(), config_id: null });

      if (error) {
        if (error.code === "23505" || error.message?.includes("duplicate") || error.message?.includes("already")) {
          toast.error("Este correo ya está registrado");
        } else {
          toast.error("Hubo un error, intenta de nuevo");
        }
        return false;
      }

      toast.success("¡Suscrito con éxito!");
      return true;
    } catch {
      toast.error("Hubo un error, intenta de nuevo");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { subscribe, loading };
};
