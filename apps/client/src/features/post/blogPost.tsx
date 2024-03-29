import { getAuthorAndSettingsData, getPostData } from '@/data';

import { Post } from './post';
import Custom404 from '../../app/not-found';
import { StructuredData } from '../../components/structured-data';

export async function BlogPost(props) {
  const [post, data] = await Promise.all([
    getPostData(props.params.slug),
    getAuthorAndSettingsData(),
  ]);
  if (!post || !data?.settings || !data?.me) {
    return <Custom404 />;
  }
  const { settings, me } = data;

  const { name = '', avatar = '' } =
    post.author?.__typename === 'Author' ? post.author : {};

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? post.sub_title,
    image: post.cover_image.src,
    author: [
      {
        '@type': 'Person',
        name: name,
      },
    ],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    publisher: {
      '@type': 'Organization',
      name: settings.site_title,
      logo: {
        '@type': 'ImageObject',
        url: avatar,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${settings.site_url}${post.slug}`,
    },
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <Post post={post} settings={settings} me={me} />
    </>
  );
}
