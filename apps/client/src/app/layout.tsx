export const runtime = 'edge';

import { Metadata } from 'next';
import { cookies } from 'next/headers';
import 'ui/css/tailwind.css';
import 'ui/css/editor.css';
import { getData } from '@/data';

import { FontPageWrapper } from '@/components/fonts';
import { HeadMeta } from '@/components/Scripts';

import { Css } from './_css';
import { HighlightCode } from './_highlightCode';
import Custom404 from './not-found';
import ThemeProvider from '../../context/ThemeProvider';
import { Footer } from '../components/footer';

const THEME_STORAGE_KEY = 'theme-preference';

export const viewport = {
  themeColor: 'black',
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getData();
    if (!data) return {};
    const { settings, me } = data;
    const description =
      settings.site_description ?? settings.site_tagline ?? '';
    return {
      metadataBase: new URL(settings.site_url),
      title: {
        default: settings.site_title,
        template: `%s | by ${me.name}`,
      },
      description,
      icons: {
        icon: [
          {
            url: '/static/favicons/favicon-16x16.png',
            sizes: '16x16',
            rel: 'icon',
            type: 'image/png',
          },
          {
            url: '/static/favicons/favicon-32x32.png',
            sizes: '32x32',
            rel: 'icon',
            type: 'image/png',
          },
          {
            url: '/static/favicons/favicon-96x96.png',
            sizes: '96x96',
            rel: 'icon',
            type: 'image/png',
          },
        ],
        shortcut: '/favicon/favicon-16x16.png',
        apple: [
          {
            url: '/static/favicons/apple-touch-icon-60x60.png',
            sizes: '60x60',
            rel: 'apple-touch-icon-precomposed',
            type: 'image/png',
          },
          {
            url: '/static/favicons/apple-touch-icon-76x76.png',
            sizes: '76x76',
            rel: 'apple-touch-icon-precomposed',
            type: 'image/png',
          },
          {
            url: '/static/favicons/apple-touch-icon-120x120.png',
            sizes: '120x120',
            rel: 'apple-touch-icon-precomposed',
            type: 'image/png',
          },
          {
            url: '/static/favicons/apple-touch-icon-152x152.png',
            sizes: '152x152',
            rel: 'apple-touch-icon-precomposed',
            type: 'image/png',
          },
        ],
      },
      robots: { index: true, follow: true },

      twitter: {
        title: settings.site_title,
        images: [
          {
            url: settings.banner?.src!,
            width: settings.banner?.width!,
            height: settings.banner?.height!,
            alt: settings.site_title,
          },
        ],
        card: 'summary_large_image',
        description,
      },
      alternates: {
        canonical: settings.site_url,
        types: {
          'application/rss+xml': settings.site_url + '/feed.xml',
        },
      },
      generator: 'Letterpad',
      authors: [{ name: me.name }],
      creator: me.name,
      publisher: settings.site_title,
      abstract: description,
      openGraph: {
        url: settings.site_url,
        title: settings.site_title,
        description,
        authors: [me.name],
        firstName: me.name,
        siteName: settings.site_title,
        images: [
          {
            url: settings.banner?.src!,
            width: 800,
            height: 600,
            alt: settings.site_title,
          },
        ],
      },
    };
  } catch (e) {
    return {};
  }
}

const Layout = async ({ children }) => {
  const data = await getData();
  if (!data) {
    return <Custom404 homepage="https://letterpad.app" />;
  }
  const theme = cookies().get(THEME_STORAGE_KEY)?.value;
  const { settings, me } = data;

  return (
    <html
      lang="en"
      className={`scroll-smooth ${theme}`}
      style={{ colorScheme: theme }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preload" as="image" href={settings.banner?.src!} />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin={'anonymous'}
      />
      <Css css={settings.css} />
      <HeadMeta settings={settings} />
      <body className="line-numbers max-w-screen flex h-full min-h-screen flex-col text-md antialiased dark:bg-opacity-20 w-[100vw]">
        <ThemeProvider storageKey={THEME_STORAGE_KEY} theme={theme}>
          <FontPageWrapper
            primary_font={settings.design?.primary_font!}
            secondary_font={settings.design?.secondary_font!}
          >
            <main className="mb-auto">{children}</main>
            <div className="border-b-[1px] dark:border-gray-700">
              <Footer author={me} settings={settings} />
            </div>
          </FontPageWrapper>
        </ThemeProvider>
        <div id="modal-creatives" />
        <HighlightCode />
      </body>
    </html>
  );
};

export default Layout;
