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
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { SocialIcon } from "react-social-icons";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const GA_MEASUREMENT_ID = "G-33KP1TNFDZ";
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
        <div className="fixed bottom-5 right-5 flex flex-col items-center justify-center gap-2.5 md:flex-row">
          <SocialIcon
            url={"https://wa.me/918100517624"}
            network="whatsapp"
            target="_blank"
          />
          <SocialIcon
            url={"https://t.me/neetbucket"}
            network="telegram"
            target="_blank"
          />
          <SocialIcon
            url={"https://instagram.com/neet_bucket"}
            network="instagram"
            target="_blank"
          />
        </div>
      </Providers>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="ga-analytics">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
      </Script>
    </ClerkProvider>
  );
}
export default MyApp;
