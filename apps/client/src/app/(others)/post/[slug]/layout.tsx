import { Metadata } from 'next';

import { getAuthorAndSettingsData, getPostData } from '@/data';

import Custom404 from '@/app/not-found';

interface PostPageLayoutProps {
  katex: React.ReactNode;
  children?: React.ReactNode;
  params: { slug: string };
}

export default async function PostPageLayout({
  children,
  params,
  katex,
}: PostPageLayoutProps) {
  const post = await getPostData(params.slug);

  if (!post) {
    return <Custom404 />;
  }

  if (post.html?.includes('letterpad-katex')) {
    return (
      <>
        {katex}
        {children}
      </>
    );
  }

  return <>{children}</>;
}

export async function generateMetadata({
  params,
}: PostPageLayoutProps): Promise<Metadata> {
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
