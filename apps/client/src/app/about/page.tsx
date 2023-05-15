import { getAbout } from '../../data';
import { BaseSEO } from '../../../components/SEO';
import { useTheme } from '../../../themes';

export default async function About() {
  const { settings, me } = await getAbout();
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
