import { Author, NavigationType } from 'letterpad-sdk';
import { headers } from 'next/headers';

import 'ui/css/tailwind.css';
import 'ui/css/editor.css';
import '@fontsource/inter/variable-full.css';

import { getData } from '../data';
import { HeadMeta } from '../../components/HeadMeta';
import { useTheme } from '../../themes';

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
        <Layout
          props={{ settings, me: me as Author }}
          isHomeCollection={isCollection}
        >
          {children}
        </Layout>

        <div id="modal-creatives" />
      </body>
    </html>
  );
};

export default Layout;
