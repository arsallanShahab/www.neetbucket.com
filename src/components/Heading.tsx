import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ElementType, FC, createElement } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "button"
    | "caption"
    | "overline";
}

const typographyStyles: Record<string, string> = {
  h1: "text-6xl font-bold text-black",
  h2: "text-5xl font-bold text-black",
  h3: "text-4xl font-bold text-black",
  h4: "text-3xl font-bold text-black",
  h5: "text-2xl font-bold text-black",
  h6: "text-xl font-bold text-black",
  subtitle1: "text-lg font-medium text-black",
  subtitle2: "text-base font-medium text-black",
  body1: "text-base font-normal text-black",
  body2: "text-sm font-normal text-black",
  button: "text-sm font-medium text-black",
  caption: "text-xs font-normal text-black",
  overline: "text-xs font-medium text-black",
};

const Heading: FC<Props> = ({ children, className, variant = "body1" }) => {
  let Component: ElementType;
  const router = useRouter();
  let handleNavigateBack: (() => void) | undefined;
  let showIcon = false;

  switch (variant) {
    case "h1":
    case "h2":
    case "h3":
      Component = variant;
      handleNavigateBack = () => router.back();
      showIcon = true;
      break;
    case "h4":
    case "h5":
    case "h6":
      Component = variant;
      break;
    case "subtitle1":
    case "subtitle2":
      Component = "h6";
      break;
    case "body1":
    case "body2":
      Component = "p";
      break;
    case "button":
      Component = "button";
      break;
    case "caption":
    case "overline":
      Component = "span";
      break;
    default:
      Component = "p";
      break;
  }

  return createElement(
    Component,
    {
      onClick: handleNavigateBack,
      role: handleNavigateBack ? "button" : undefined,
      tabIndex: handleNavigateBack ? 0 : undefined,
      className: cn(typographyStyles[variant], className),
    },
    <div className="flex items-center justify-start gap-2.5">
      {showIcon && <div className="h-4 w-1 rounded-xl bg-green-500"></div>}
      {/* {!showIcon && <div className="h-4 w-1 rounded-xl bg-zinc-300"></div>} */}
      {children}
    </div>,
  );
};

export default Heading;
