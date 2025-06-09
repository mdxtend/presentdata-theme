import "@/styles/globals.css";

import type { AppProps } from "next/app";
import Header from "@/components/Navigations/Header";
// import SaveScroll from '@/components/Hooks/SaveScroll';
// import RestoreScroll from '@/components/Hooks/RestoreScroll';
// import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/Hooks/ThemeProvider";
import Footer from "@/components/Navigations/Footer";

export default function MyApp({ Component, pageProps }: AppProps) {
  // const [scrollbarWidth, setScrollbarWidth] = useState(0);

  // useEffect(() => {
  //   const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  //   setScrollbarWidth(scrollbar);
  // }, []);
  // console.log(scrollbarWidth);


  return (
    <>
      {/* <SaveScroll />
      <RestoreScroll /> */}
      <ThemeProvider>
        {/* <div className={`${scrollbarWidth === 0 ? "pr-[10px] max-lg:p-0" : ""}`}> */}
        <Header />
        <div className={`max-w-7xl w-full mx-auto border-x border-border max-xl:border-x-0 min-h-screen`}>
          <Component {...pageProps} />
        </div>
        <Footer />
        {/* </div> */}
      </ThemeProvider>
    </>
  );
}
