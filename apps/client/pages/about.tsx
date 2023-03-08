import { Letterpad } from 'letterpad-sdk';
import { InferGetServerSidePropsType } from 'next';

import { BaseSEO } from '../components/SEO';
import { useTheme } from '../themes';

export default function About({
  settings,
  me,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { name, social } = me;

  const { About } = useTheme(settings?.theme);

  return (
    <>
      <BaseSEO
        title={`About - ${name}`}
        description={`About me - ${name}`}
        site_banner={settings.banner?.src}
        site_title={settings.site_title}
        url={settings.site_url + 'page/about'}
        twSite={social?.twitter}
      />
      <About me={me} settings={settings} />
    </>
  );
}

export async function getServerSideProps(context: any) {
  const letterpad = new Letterpad({
    letterpadServer: {
      url: process.env.API_URL!,
      token: process.env.CLIENT_ID!,
      host: context.req.headers.host,
    },
  });

  const me = await letterpad.getAuthor();
  const settings = await letterpad.getSettings();

  return {
    props: { me, settings },
  };
}
