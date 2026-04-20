import { cn } from "@/lib/utils";

interface AdSlotProps {
  zone: "A" | "B" | "C";
  className?: string;
}

const ZONE_CONFIG = {
  A: {
    label: "A",
    desktopSize: "728x90",
    mobileSize: "320x50",
    desktopHeight: "min-h-[90px]",
    mobileHeight: "min-h-[50px]",
  },
  B: {
    label: "B",
    desktopSize: "300x250",
    mobileSize: "300x250",
    desktopHeight: "min-h-[250px]",
    mobileHeight: "min-h-[250px]",
  },
  C: {
    label: "C",
    desktopSize: "728x90",
    mobileSize: "320x50",
    desktopHeight: "min-h-[90px]",
    mobileHeight: "min-h-[50px]",
  },
} as const;

export function AdSlot({ zone, className }: AdSlotProps) {
  const config = ZONE_CONFIG[zone];

  return (
    <div className={cn("w-full", className)}>
      {/* Legal Label */}
      <span className="block text-[10px] text-muted-foreground text-left mb-1">
        Publicidad
      </span>

      {/* Ad Container */}
      <div
        className={cn(
          "w-full flex items-center justify-center",
          "bg-[#F4F4F5] rounded-sm",
          config.mobileHeight,
          config.desktopHeight
        )}
      >
        {/* Mockup Content */}
        <div className="text-center px-4">
          <p className="text-sm font-medium text-muted-foreground">
            Espacio Publicitario {config.label}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            <span className="hidden sm:inline">{config.desktopSize}</span>
            <span className="sm:hidden">{config.mobileSize}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdSlot;
