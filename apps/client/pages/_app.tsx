import {
  Author,
  NavigationType,
  SettingsFragmentFragment,
} from 'letterpad-sdk';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import { useMemo } from 'react';

import 'ui/css/tailwind.css';
import 'ui/css/editor.css';
import '@fontsource/inter/variable-full.css';

import { useTheme } from '../themes';

declare global {
  interface Window {
    Prism: Record<string, () => void>;
  }
}

interface PageProps {
  settings: SettingsFragmentFragment;
  me: Author;
}
export default function App({ Component, pageProps }: AppProps<PageProps>) {
  const { srcs, contents } = getScripts(pageProps.settings?.scripts ?? '');
  const { Layout } = useTheme(pageProps?.settings?.theme);
  const router = useRouter();
  const isCollection = useMemo(() => {
    const [firstItemOfMenu] = pageProps?.settings?.menu ?? [];
    return (
      firstItemOfMenu?.type === NavigationType.Tag && router.pathname === '/'
    );
  }, [pageProps?.settings?.menu, router.pathname]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <style>
          {`
          html {
            --brand-accent: ${
              pageProps.settings?.design?.brand_color ?? '#d93097'
            };
          }
          `}
        </style>
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
        <Layout
          props={pageProps}
          pageName={Component.name}
          isHomeCollection={isCollection}
        >
          <Component {...pageProps} />
        </Layout>
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
