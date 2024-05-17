import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

interface NextButtonProps {
  type?: "button" | "submit" | "reset";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  colorScheme?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "badge";
  loading?: boolean;
}

const getColorSchemeClass = (colorScheme: NextButtonProps["colorScheme"]) => {
  switch (colorScheme) {
    case "primary":
      return "border-pruple-100 border bg-purple-600 hover:bg-purple-500 active:bg-purple-800";
    case "secondary":
      return "border border-blue-100 bg-blue-600 hover:bg-blue-500 active:bg-blue-800";
    case "success":
      return "border border-green-100 bg-green-600 hover:bg-green-500 active:bg-green-800";
    case "warning":
      return "border border-yellow-100 bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-800";
    case "error":
      return "border border-red-100 bg-red-600 hover:bg-red-500 active:bg-red-800";
    case "badge":
      return "rounded-lg py-2 bg-zinc-950 text-white h-auto shadow-none border-none";
    default:
      return "border border-zinc-100 text-black bg-transparent hover:bg-zinc-100 active:bg-zinc-200";
  }
};

const NextButton = forwardRef<HTMLButtonElement, NextButtonProps>(
  (
    {
      type = "button",
      colorScheme,
      loading = false,
      disabled = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const variant = colorScheme === "primary" ? "solid" : "bordered";
    const colorSchemeClass = getColorSchemeClass(colorScheme);

    return (
      <Button
        ref={ref}
        type={type}
        variant={variant}
        className={cn(
          "text-xs font-medium text-white shadow-small active:scale-95",
          colorSchemeClass,
          className,
        )}
        isDisabled={disabled || loading}
        {...rest}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
      </Button>
    );
  },
);

NextButton.displayName = "NextButton";

export default NextButton;
