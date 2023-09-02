import { getTagsData } from '@/data';

import { BaseSEO } from '@/components/SEO';

import { useTheme } from '../../../themes';

export default async function Tags() {
  const { settings, me, tags } = await getTagsData();
  const { Tags } = useTheme(settings?.theme);

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
