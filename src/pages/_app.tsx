import Navbar from "@/components/navbar";
import { Providers } from "@/components/providers";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      afterSignInUrl="/"
      appearance={{
        layout: {
          socialButtonsVariant: "blockButton",
        },
        baseTheme: {
          __type: "prebuilt_appearance",
        },
      }}
      {...pageProps}
    >
      <Providers>
        <Navbar />
        <Component {...pageProps} />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              borderRadius: "90px",
              fontSize: "16px",
              fontWeight: "600",
              backgroundColor: "#000",
              color: "#FFF",
              textAlign: "center",
            },
          }}
        />
      </Providers>
    </ClerkProvider>
  );
}
export default MyApp;
