export const runtime = 'edge';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getAuthorAndSettingsData, getPostData } from '@/data';

import StructuredData from '@/components/StructuredData';

import { getTheme } from '@/themes';

export default async function Post(props) {
  const post = await getPostData(props.params.slug);
  const { settings, me } = await getAuthorAndSettingsData();
  if (!post || !settings || !me) {
    return notFound();
  }

  const { Post } = getTheme(settings?.theme);
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

export async function generateMetadata({
  params,
  searchParams,
}): Promise<Metadata> {
  const post = await getPostData(params.slug);
  const { settings, me } = await getAuthorAndSettingsData();
  if (!post) return {};
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
      description: post.excerpt,
    },
    alternates: {
      canonical: `${settings.site_url}${post.slug}`,
    },
    openGraph: {
      url: `${settings.site_url}${post.slug}`,
      title: post.title,
      description: post.excerpt,
      authors: [me.name],
      siteName: settings.site_title,
      type: 'article',
    },
  };
}
