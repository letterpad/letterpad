import { Author, SettingsFragmentFragment } from 'letterpad-sdk';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import 'lazysizes';

import 'ui/css/tailwind.css';
import 'ui/css/editor.css';
import '@fontsource/inter/variable-full.css';

import LayoutWrapper from '@/components/LayoutWrapper';

interface PageProps {
  settings: SettingsFragmentFragment;
  me: Author;
}
export default function App({ Component, pageProps }: AppProps<PageProps>) {
  const { srcs, contents } = getScripts(pageProps.settings?.scripts ?? '');
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
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
      {pageProps.settings ? (
        <LayoutWrapper props={pageProps}>
          <Component {...pageProps} />
        </LayoutWrapper>
      ) : (
        <Component {...pageProps} />
      )}
    </ThemeProvider>
  );
}

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
