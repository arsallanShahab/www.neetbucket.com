import { cn } from "@/lib/utils";
import { Input, InputProps } from "@nextui-org/react";

interface NextInputProps extends InputProps {
  type?:
    | "text"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "week"
    | "color";
  label?: string;
  labelPlacement?: "outside" | "inside";
  placeholder: string;
  className?: string;
  value: string;
  onValueChange: (value: string) => void;
}

const NextInput = ({
  type = "text",
  label = "",
  labelPlacement = "outside",
  placeholder = "",
  className = "",
  value = "",
  onValueChange,
  ...rest
}: NextInputProps) => {
  return (
    <Input
      type={type}
      label={label}
      labelPlacement={labelPlacement}
      placeholder={placeholder}
      color="default"
      radius="md"
      size="lg"
      variant="flat"
      classNames={{ inputWrapper: "border" }}
      className={cn(className)}
      value={value}
      onValueChange={onValueChange}
      {...rest}
    />
  );
};

export default NextInput;
