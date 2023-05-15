// import  { Head, Html, Main, NextScript } from 'next/document';

import { Author, NavigationType } from 'letterpad-sdk';
import { headers } from 'next/headers';
import Script from 'next/script';

import 'ui/css/tailwind.css';
import 'ui/css/editor.css';
import '@fontsource/inter/variable-full.css';

import { getData } from '../data';
import { useTheme } from '../../themes';

const Layout = async ({ children }) => {
  const { settings, me } = await getData();
  const { srcs, contents } = getScripts(settings?.scripts ?? '');
  const { Layout } = useTheme(settings?.theme);
  const headersList = headers();
  const [firstItemOfMenu] = settings?.menu ?? [];
  const isCollection =
    firstItemOfMenu?.type === NavigationType.Tag &&
    headersList.get('x-url') === '/';

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="apple-touch-icon-precomposed"
          sizes="57x57"
          href="/static/favicons/apple-touch-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="114x114"
          href="/static/favicons/apple-touch-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="72x72"
          href="/static/favicons/apple-touch-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="144x144"
          href="/static/favicons/apple-touch-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="60x60"
          href="/static/favicons/apple-touch-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="120x120"
          href="/static/favicons/apple-touch-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="76x76"
          href="/static/favicons/apple-touch-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="152x152"
          href="/static/favicons/apple-touch-icon-152x152.png"
        />
        <link
          rel="icon"
          type="image/png"
          href="/static/favicons/favicon-196x196.png"
          sizes="196x196"
        />
        <link
          rel="icon"
          type="image/png"
          href="/static/favicons/favicon-96x96.png"
          sizes="96x96"
        />
        <link
          rel="icon"
          type="image/png"
          href="/static/favicons/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="/static/favicons/favicon-16x16.png"
          sizes="16x16"
        />
        <link
          rel="icon"
          type="image/png"
          href="/static/favicons/favicon-128.png"
          sizes="128x128"
        />
        <meta name="application-name" content="Letterpad" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="msapplication-TileImage" content="mstile-144x144.png" />
        <meta name="msapplication-square70x70logo" content="mstile-70x70.png" />
        <meta
          name="msapplication-square150x150logo"
          content="mstile-150x150.png"
        />
        <meta
          name="msapplication-wide310x150logo"
          content="mstile-310x150.png"
        />
        <meta
          name="msapplication-square310x310logo"
          content="mstile-310x310.png"
        />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <script src="/static/prism.js" async />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;0,600;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <style>
          {`
          html {
            --brand-accent: ${settings?.design?.brand_color ?? '#d93097'};
          }
          `}
        </style>
        {srcs.map((src) => (
          <Script strategy="afterInteractive" src={src} key={src} />
        ))}
        {contents.map((src, idx) => (
          <Script
            key={idx}
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: src,
            }}
          />
        ))}
      </head>
      <body className="line-numbers text-md antialiased dark:bg-opacity-20">
        {settings && (
          <Layout
            props={{ settings, me: me as Author }}
            isHomeCollection={isCollection}
          >
            {children}
          </Layout>
        )}

        <div id="modal-creatives" />
      </body>
    </html>
  );
};

export default Layout;

function getScripts(str: string) {
  const srcs: string[] = [];
  const contents: string[] = [];
  if (typeof window === 'undefined') return { srcs, contents };
  var doc = document.implementation.createHTMLDocument(); // Sandbox
  doc.body.innerHTML = str; // Parse HTML properly

  const scripts = doc.querySelectorAll('script');
  scripts.forEach((el: HTMLScriptElement) => {
    if (el.src) srcs.push(el.src);
    if (el.textContent) contents.push(el.textContent);
  });

  return { srcs, contents };
}
