import FlexContainer from "@/components/FlexContainer";
import Navbar from "@/components/navbar";
import { Providers } from "@/components/providers";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import {
  dark,
  experimental__simple,
  experimental_createTheme,
  neobrutalism,
  shadesOfPurple,
} from "@clerk/themes";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import { SocialIcon } from "react-social-icons";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsVariant: "auto",
        },
      }}
      routerPush={true}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
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
        <FlexContainer className="fixed bottom-5 right-5">
          <SocialIcon
            url={"https://wa.me/918100517624"}
            network="whatsapp"
            target="_blank"
          />
        </FlexContainer>
      </Providers>
    </ClerkProvider>
  );
}
export default MyApp;
