import { getPostsByTag } from '@/data';

import { TagSEO } from '@/components/SEO';

import { useTheme } from '../../../../themes';

export default async function Tag(props) {
  const { posts, me, tagName, settings } = await getPostsByTag(
    props.params.tag
  );

  const { Tag } = useTheme(settings?.theme);
  if (
    posts.__typename !== 'PostsNode' ||
    settings.__typename !== 'Setting' ||
    me?.__typename !== 'Author'
  ) {
    return null;
  }
  return (
    <>
      <TagSEO
        title={`${tagName} - ${settings.site_title}`}
        description={`${tagName} - Tag of ${settings.site_title}`}
        site_banner={settings.banner?.src}
        site_title={settings.site_title}
        url={settings.site_url + 'tags'}
        twSite={me.social?.twitter}
      />
      <Tag posts={posts} settings={settings} me={me} tagName={tagName} />
    </>
  );
}
