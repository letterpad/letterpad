import { Author, NavigationType } from 'letterpad-sdk';
import { headers } from 'next/headers';

import 'ui/css/tailwind.css';
import 'ui/css/editor.css';

import { getData } from '@/data';

import { FontPageWrapper } from '@/components/fonts';
import { HeadMeta } from '@/components/HeadMeta';

import { useTheme } from '@/themes';

export const dynamic = 'force-dynamic';

const Layout = async ({ children }) => {
  const { settings, me } = await getData();

  const { Layout } = useTheme(settings?.theme);
  const headersList = headers();
  const [firstItemOfMenu] = settings?.menu ?? [];
  const isCollection =
    firstItemOfMenu?.type === NavigationType.Tag &&
    headersList.get('x-url') === '/';

  return (
    <html lang="en" className="scroll-smooth">
      <HeadMeta settings={settings} />
      <body className="line-numbers flex h-full min-h-screen flex-col text-md antialiased dark:bg-opacity-20">
        <FontPageWrapper
          primary_font={settings.design?.primary_font}
          secondary_font={settings.design?.secondary_font}
        >
          <Layout
            props={{ settings, me: me as Author }}
            isHomeCollection={isCollection}
          >
            {children}
          </Layout>
        </FontPageWrapper>
        <div id="modal-creatives" />
      </body>
    </html>
  );
};

export default Layout;
