import { Metadata } from 'next';

import StructuredData from '@/components/StructuredData';

import { useTheme } from '../../../../themes';
import { getPostData } from '../../../data';

export default async function Post(props) {
  const { post, settings, me } = await getPostData(props.params.slug);
  const { Post } = useTheme(settings?.theme);
  const { name = '', avatar = '' } =
    post.author?.__typename === 'Author' ? post.author : {};

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
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

export async function generateMetadata({
  params,
  searchParams,
}): Promise<Metadata> {
  const { post, settings, me } = await getPostData(params.slug);
  return {
    title: post.title,
    description: post.excerpt ?? '',
    twitter: {
      title: post.title,
      images: [
        {
          url: post.cover_image?.src!,
          width: post.cover_image?.width,
          height: post.cover_image?.height,
          alt: post.title,
        },
      ],
      card: 'summary_large_image',
      description: me.bio,
    },
    openGraph: {
      url: `${settings.site_url}${post.slug}`,
      title: post.title,
      description: post.excerpt,
      authors: [me.name],
      firstName: me.name,
      siteName: settings.site_title,
      images: [
        {
          url: post.cover_image.src!,
          width: post.cover_image.width,
          height: post.cover_image.height,
          alt: post.title,
        },
      ],
    },
  };
}
