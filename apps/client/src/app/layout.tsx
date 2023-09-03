import 'ui/css/tailwind.css';
import 'ui/css/editor.css';

import { getData } from '@/data';

import { FontPageWrapper } from '@/components/fonts';
import { HeadMeta } from '@/components/HeadMeta';

import { useTheme } from '@/themes';

import { Css } from './_css';

const Layout = async ({ children }) => {
  const { settings, me } = await getData();

  const { Layout } = useTheme(settings?.theme);

  return (
    <html lang="en" className="scroll-smooth">
      <Css css={settings.css} />
      <HeadMeta settings={settings} />
      <body className="line-numbers flex h-full min-h-screen flex-col text-md antialiased dark:bg-opacity-20">
        <FontPageWrapper
          primary_font={settings.design?.primary_font}
          secondary_font={settings.design?.secondary_font}
        >
          <Layout props={{ settings, me }}>{children}</Layout>
        </FontPageWrapper>
        <div id="modal-creatives" />
      </body>
    </html>
  );
};

export default Layout;
