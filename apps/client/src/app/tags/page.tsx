export const runtime = 'edge';

import { getTagsData } from '@/data';

import { BaseSEO } from '@/components/SEO';

import { getTheme } from '../../../themes';
import Custom404 from '../not-found';

export default async function Tags() {
  const data = await getTagsData();
  if (!data?.tags || !data?.settings || !data?.me) {
    return <Custom404 homepage="https://letterpad.app" />;
  }
  const { tags, settings, me } = data;
  const { Tags } = getTheme(settings?.theme);

  if (
    me?.__typename !== 'Author' ||
    tags.__typename !== 'TagsNode' ||
    settings.__typename !== 'Setting'
  )
    return null;
  return (
    <>
      <BaseSEO
        title={`Tags - ${me.name}`}
        description="Things I blog about"
        site_banner={settings.banner?.src}
        site_title={settings.site_title}
        url={settings.site_url}
        twSite={me.social?.twitter}
      />
      <Tags me={me} settings={settings} tags={tags} />
    </>
  );
}
