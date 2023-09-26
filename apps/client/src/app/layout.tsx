export const runtime = 'edge';

import 'ui/css/tailwind.css';
import 'ui/css/editor.css';

import { getData } from '@/data';

import { FontPageWrapper } from '@/components/fonts';
import { HeadMeta } from '@/components/HeadMeta';

import { getTheme } from '@/themes';

import { Css } from './_css';
import Custom404 from './not-found';

const Layout = async ({ children }) => {
  const data = await getData();
  if (!data) {
    return <Custom404 homepage="https://letterpad.app" />;
  }
  const { settings } = data;
  const { Layout } = getTheme(settings?.theme);

  return (
    <html lang="en" className="scroll-smooth">
      <Css css={settings.css} />
      <HeadMeta settings={settings} />
      <body className="line-numbers max-w-screen flex h-full min-h-screen flex-col text-md antialiased dark:bg-opacity-20">
        <FontPageWrapper
          primary_font={settings.design?.primary_font}
          secondary_font={settings.design?.secondary_font}
        >
          <Layout>{children}</Layout>
        </FontPageWrapper>
        <div id="modal-creatives" />
      </body>
    </html>
  );
};

export default Layout;
