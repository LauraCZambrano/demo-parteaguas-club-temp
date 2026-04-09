import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSubscribe } from "@/hooks/useSubscribe";

interface SubscribeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubscribeDialog = ({ open, onOpenChange }: SubscribeDialogProps) => {
  const [email, setEmail] = useState("");
  const { subscribe, loading } = useSubscribe();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      const success = await subscribe(email);
      if (success) {
        setEmail("");
        onOpenChange(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Suscríbete al newsletter</DialogTitle>
          <DialogDescription className="text-center">
            Ideas que marcan un antes y un después. Recibe análisis diario sin distracciones.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 flex-1 rounded-full px-4"
            required
          />
          <Button type="submit" className="h-11 rounded-full px-6 font-semibold" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Unirse"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscribeDialog;
