import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'next-themes';

import '@/css/tailwind.css';
import '@/css/prism.css';
// import '@fontsource/inter';
import '@fontsource/inter/variable-full.css';

import Analytics from '@/components/analytics';
import { ClientReload } from '@/components/ClientReload';
import LayoutWrapper from '@/components/LayoutWrapper';

const isDevelopment = process.env.NODE_ENV === 'development';
const isSocket = process.env.SOCKET;

interface PageProps {
  settings: any;
  me: any;
}
export default function App({ Component, pageProps }: AppProps<PageProps>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      {isDevelopment && isSocket && <ClientReload />}
      <Analytics id={pageProps.me?.analytics_uuid} />
      {pageProps.settings ? (
        <LayoutWrapper props={pageProps}>
          {/* @ts-ignore */}
          <Component {...pageProps} />
        </LayoutWrapper>
      ) : (
        // @ts-ignore
        <Component {...pageProps} />
      )}
    </ThemeProvider>
  );
}
