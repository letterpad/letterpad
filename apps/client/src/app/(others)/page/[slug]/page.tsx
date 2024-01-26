export const runtime = 'edge';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getAuthorAndSettingsData, getPostData } from '@/data';

import Creative from '@/layouts/Creative';
import { getTheme } from '@/themes';
import Custom404 from '../../../not-found';
import { StructuredData } from '../../../../components/structured-data';
import { Post } from '../../../../features/post/post';

export default async function Page(props) {
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
      {post.page_type === 'story-builder' ? (
        <Creative
          data={post}
          site_name={settings.site_title}
          settings={settings}
          me={me}
        />
      ) : (
        <Post post={post} settings={settings} me={me} />
      )}
    </>
  );
}

export async function generateMetadata({
  params,
  searchParams,
}): Promise<Metadata> {
  const post = await getPostData(params.slug);
  const data = await getAuthorAndSettingsData();
  if (!post || !data?.me || !data?.settings) return {};
  const { settings, me } = data;
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
      description: me.bio!,
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
