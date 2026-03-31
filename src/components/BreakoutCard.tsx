import iconParteaguas from "@/assets/icon-parteaguas.png";

interface BreakoutCardProps {
  title?: string;
  label?: string;
  children: React.ReactNode;
}

const BreakoutCard = ({
  title = "La Idea de la Semana",
  label = "Destacado",
  children,
}: BreakoutCardProps) => {
  return (
    <div className="relative border-2 border-foreground bg-primary p-6 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] md:p-8">
      {/* Label badge */}
      <span className="absolute -top-3 left-4 inline-block bg-foreground px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-background">
        {label}
      </span>

      <div className="flex items-start gap-4">
        <img
          src={iconParteaguas}
          alt=""
          className="mt-1 hidden h-10 w-10 shrink-0 sm:block"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <h3 className="font-editorial text-xl font-bold leading-snug tracking-tight text-primary-foreground md:text-2xl">
            {title}
          </h3>
          <div className="mt-3 text-sm leading-relaxed text-primary-foreground/80">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakoutCard;
