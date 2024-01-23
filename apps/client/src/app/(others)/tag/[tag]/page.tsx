export const runtime = 'edge';

import { Metadata } from 'next';

import { getPostsByTag } from '@/data';

import { getTheme } from '../../../../../themes';
import Custom404 from '../../../not-found';

export default async function Tag(props) {
  const data = await getPostsByTag(props.params.tag);
  if (!data) return <Custom404 homepage="https://letterpad.app" />;
  const { posts, settings, me, tagName } = data;

  const { Tag } = getTheme(settings?.theme);
  if (
    posts.__typename !== 'PostsNode' ||
    settings?.__typename !== 'Setting' ||
    me?.__typename !== 'Author'
  ) {
    return null;
  }
  return (
    <>
      <Tag posts={posts} settings={settings} me={me} tagName={tagName} />
    </>
  );
}

export async function generateMetadata({
  params,
  searchParams,
}): Promise<Metadata> {
  const data = await getPostsByTag(params.tag);
  if (!data || !data.settings || !data.me) return {};
  const { posts, settings, me } = data;
  return {
    title: `#${params.tag} - Posts from ${settings.site_title}`,
    description: `Posts tagged with #${params.tag}`,
    alternates: {
      canonical: `${settings.site_url}/tag/${params.tag}`,
    },
    openGraph: {
      url: `${settings.site_url}/tag/${params.tag}`,
      title: `#${params.tag} - Posts from ${settings.site_title}`,
      description: `Posts tagged with #${params.tag}`,
      authors: [me.name],
      firstName: me.name,
      siteName: settings.site_title,
    },
    twitter: {
      title: `#${params.tag} - Posts from ${settings.site_title}`,
      card: 'summary_large_image',
      description: `Posts tagged with #${params.tag}`,
      creator: me.social?.twitter!,
    },
  };
}
