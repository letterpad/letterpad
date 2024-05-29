// export const runtime = 'edge';

import { Metadata } from 'next';

import { getPostsByTag } from '@/data';

import { List } from '../../../../components/list';
import { SectionContainer } from '../../../../components/section';
import Custom404 from '../../../not-found';

export default async function Tag(props) {
  const data = await getPostsByTag(props.params.tag);
  if (!data) return <Custom404 />;
  const { posts, settings, me, tagName } = data;

  if (
    posts.__typename !== 'PostsNode' ||
    settings?.__typename !== 'Setting' ||
    me?.__typename !== 'Author'
  ) {
    return null;
  }
  return (
    <>
      <SectionContainer className="content">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <div className="text-3xl font-bold py-1 border-b-[1px] dark:border-gray-700">
            {tagName}
          </div>
        </div>
      </SectionContainer>
      <List posts={posts} />
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
    title: {
      default: 'Read my posts related to ' + params.tag,
      template: `%s | by ${me.name}`,
    },
    description: `Posts tagged with #${params.tag}`,
    alternates: {
      canonical: `${settings.site_url}/tag/${params.tag}`,
    },
    openGraph: {
      url: `${settings.site_url}/tag/${params.tag}`,
      title: `#${params.tag} - Posts from ${settings.site_title}`,
      description: `Posts tagged with #${params.tag}`,
      authors: [me.name!],
      firstName: me.name!,
      siteName: settings.site_title!,
    },
    twitter: {
      title: `#${params.tag} - Posts from ${settings.site_title}`,
      card: 'summary_large_image',
      description: `Posts tagged with #${params.tag}`,
      creator: me.social?.twitter!,
    },
  };
}
