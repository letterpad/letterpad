export const runtime = 'edge';

import { Metadata } from 'next';

import { getAuthorAndSettingsData, getPostData } from '@/data';

import { BlogPost } from '../../../../features/post/blogPost';
import { Suspense } from 'react';
import { Skeleton } from '../../../../features/post/skeleton';

export default async function Post(props) {
  return (
    <Suspense fallback={<Skeleton />}>
      <BlogPost {...props} />
    </Suspense>
  );
}

export async function generateMetadata({
  params,
  searchParams,
}): Promise<Metadata> {
  const [post, data] = await Promise.all([
    getPostData(params.slug),
    getAuthorAndSettingsData(),
  ]);
  if (!post || !data?.settings || !data?.me) return {};
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
