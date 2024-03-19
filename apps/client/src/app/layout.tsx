// export const runtime = 'edge';
import { get } from '@vercel/edge-config';
import classNames from 'classnames';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Script from 'next/script';

import 'ui/css/tailwind.css';
import 'ui/css/editor.css';

import { getData } from '@/data';

import { HeadMeta } from '@/components/Scripts';

import { Css } from './_css';
import { ClientThemeProvider } from './ClientThemeProvider';
import Custom404 from './not-found';
import { fonts } from '../components/fonts';
import { Footer } from '../components/footer';
import { SessionProvider } from '../../context/SessionProvider';

export const viewport = {
  themeColor: 'black',
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    if (process.env.EDGE_CONFIG) {
      const isInMaintenanceMode = await get<boolean>('isInMaintenanceMode');
      if (!isInMaintenanceMode) {
        return {};
      }
    }
    const data = await getData();
    if (!data) return {};
    const { settings, me } = data;
    const description =
      settings.site_description ?? settings.site_tagline ?? '';
    return {
      metadataBase: new URL(settings.site_url),
      title: {
        default:
          settings.site_title === 'Letterpad' ? me.name : settings.site_title,
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
  if (process.env.EDGE_CONFIG) {
    const isInMaintenanceMode = await get<boolean>('isInMaintenanceMode');
    if (isInMaintenanceMode) {
      return <>{children}</>;
    }
  }
  const data = await getData();
  if (!data) {
    return <Custom404 />;
  }
  const theme = cookies().get('theme-preference')?.value ?? 'light';
  const { settings, me } = data;
  return (
    <ClientThemeProvider theme={theme}>
      <html
        lang="en"
        style={{ colorScheme: theme }}
        className={classNames(
          `scroll-smooth ${theme}`,
          fonts.heading.variable,
          fonts.code.variable,
          fonts.paragraph.variable,
          fonts.sans.variable
        )}
      >
        <Css css={settings.css} />
        <HeadMeta settings={settings} />
        <body className="line-numbers max-w-screen flex h-full min-h-screen flex-col text-md antialiased dark:bg-opacity-20 w-[100vw]">
          <style
            dangerouslySetInnerHTML={{
              __html: `
          html {
            --accent: ${settings?.design?.brand_color ?? '#d93097'};
          }
        `,
            }}
          />
          {process.env.NODE_ENV === 'production' && (
            <Script id="google-analytics" strategy="afterInteractive">
              {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://ping.letterpad.app/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-557WRD5R')
          `}
            </Script>
          )}

          {process.env.NODE_ENV === 'production' && (
            <noscript>
              <iframe
                src="https://ping.letterpad.app/ns.html?id=GTM-557WRD5R"
                height="0"
                width="0"
                className="hidden"
              ></iframe>
            </noscript>
          )}

          <SessionProvider>
            <main className="mb-auto">{children}</main>
            <div className="border-b-[1px] dark:border-gray-700">
              <Footer author={me} settings={settings} />
            </div>
            <div id="modal-creatives" />
            <div id="modal-root" />
            <div id="message" />
          </SessionProvider>
        </body>
      </html>
    </ClientThemeProvider>
  );
};

export default Layout;
