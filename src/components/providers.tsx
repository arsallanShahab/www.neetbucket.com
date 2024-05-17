// app/providers.tsx
"use client";

import { persistor, store } from "@/redux/store";
import { NextUIProvider } from "@nextui-org/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import FlexContainer from "./FlexContainer";
import { ContextProvider } from "./context-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <ReduxProvider store={store}>
      <PersistGate
        loading={
          <FlexContainer variant="row-center" className="h-screen w-full">
            <Loader2 size="3rem" className="animate-spin" />
          </FlexContainer>
        }
        persistor={persistor}
      >
        <NextUIProvider navigate={router.push}>
          <ContextProvider>{children}</ContextProvider>
        </NextUIProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
