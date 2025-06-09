import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f0f0f" />
        <meta name="description" content="SECTECT delivers secure, scalable solutions for safeguarding data, systems, and communications—combining open technologies with enterprise-grade reliability." />
        <meta name="keywords" content="Sectect, Cybersecurity, Secure, Firewall, Encryption, Decryption, Security, Tools, Enterprise, Open Source" />
        <meta name="author" content="Gautam Ankoji" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="SECTECT ▪ Create and implement secure solutions for data, devices, and networks" />
        <meta property="og:description" content="SECTECT delivers secure, open solutions for digital infrastructure, built for scalability, standards, and control." />
        <meta property="og:image" content="/sectect.jpg" />
        <meta property="og:url" content="https://sectect.com" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SECTECT ▪ Create and implement secure solutions for data, devices, and networks" />
        <meta name="twitter:description" content="SECTECT delivers secure, open solutions for digital infrastructure, built for scalability, standards, and control." />
        <meta name="twitter:image" content="/sectect.jpg" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        {/* <link rel="manifest" href="/site.webmanifest" /> */}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased bg-neutral-950 text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
