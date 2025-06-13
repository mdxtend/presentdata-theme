import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-theme="dark">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f0f0f" />
        <meta name="description" content="PresentDATA CMS by MDXtend — a flexible and secure platform to build, manage, and publish content-rich sites using open standards and GitHub integration." />
        <meta name="keywords" content="PresentDATA, CMS, MDXtend, Markdown, GitHub, Content Management, Portfolio, Blog, Open Source" />
        <meta name="author" content="Gautam Ankoji" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="PresentDATA ▪ A GitHub-integrated CMS for developers and creators" />
        <meta property="og:description" content="PresentDATA helps you build and manage research portfolios, blogs, and creative projects with Git-based workflows and MDX components." />
        <meta property="og:image" content="/presentdata.jpg" />
        <meta property="og:url" content="https://presentdata.dev" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PresentDATA ▪ A GitHub-integrated CMS for developers and creators" />
        <meta name="twitter:description" content="PresentDATA helps you build and manage research portfolios, blogs, and creative projects with Git-based workflows and MDX components." />
        <meta name="twitter:image" content="/presentdata.jpg" />

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
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
