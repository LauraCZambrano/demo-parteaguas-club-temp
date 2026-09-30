import { useBrand } from "@/hooks/useBrand";

interface BrandLogoProps {
  className?: string;
  /** Text classes when there is no logo and the name is shown instead. */
  textClassName?: string;
}

/** The site's logo from Tarimah, or its name while it loads or when it has none. */
const BrandLogo = ({ className = "h-12 w-auto", textClassName = "font-editorial text-xl font-bold" }: BrandLogoProps) => {
  const { name, logo } = useBrand();
  if (logo) return <img src={logo} alt={name} className={className} />;
  return <span className={textClassName}>{name}</span>;
};

export default BrandLogo;
