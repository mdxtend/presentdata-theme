import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "@/components/Navigations/Header";
import Footer from "@/components/Navigations/Footer";
import { ThemeProvider } from "@/components/Hooks/ThemeProvider";
// import PageTransition from "@/components/Elements/PageTransition";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Header />
      <div className="max-w-7xl w-full mx-auto border-x border-border max-xl:border-x-0 min-h-[calc(100vh-8rem)]">
        {/* <PageTransition> */}
          <Component {...pageProps} />
        {/* </PageTransition> */}
      </div>
      <Footer />
    </ThemeProvider>
  );
}
