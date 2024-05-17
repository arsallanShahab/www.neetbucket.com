import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Wrapper = (props: Props) => {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-screen-2xl p-7 *:w-full sm:p-10",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};

export default Wrapper;
