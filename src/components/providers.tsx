// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ContextProvider } from "./context-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ContextProvider>{children}</ContextProvider>
    </NextUIProvider>
  );
}
