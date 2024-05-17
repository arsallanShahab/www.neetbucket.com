import { cn } from "@/lib/utils";

interface GridContainerProps {
  children: React.ReactNode;
  gap?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const getGapClass = (gap: GridContainerProps["gap"]) => {
  switch (gap) {
    case "xs":
      return "gap-1";
    case "sm":
      return "gap-2";
    case "md":
      return "gap-3";
    case "lg":
      return "gap-4";
    case "xl":
      return "gap-5";
    case "2xl":
      return "gap-6";
    default:
      return "gap-3";
  }
};

const GridContainer = ({
  gap = "md",
  className,
  children,
}: GridContainerProps) => {
  const gapClass = getGapClass(gap);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        gapClass,
        className,
      )}
    >
      {children}
    </div>
  );
};

export default GridContainer;
