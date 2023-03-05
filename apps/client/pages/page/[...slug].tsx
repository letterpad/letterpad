import { Letterpad } from 'letterpad-sdk';
import { InferGetServerSidePropsType } from 'next';
import { useEffect } from 'react';

import { BlogSEO } from '@/components/SEO';

import Creative from '@/layouts/Creative';

import { useTheme } from '../../themes';

export default function Page({
  post,
  settings,
  me,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { Post } = useTheme({
    theme: settings.theme === 'minimal' ? 'list' : 'grid',
  });
  const { name = '', avatar = '' } =
    post.author?.__typename === 'Author' ? post.author : {};

  useEffect(() => {
    if (typeof window.Prism !== 'undefined') {
      window.Prism.highlightAll();
    }
  }, [post]);

  const authorDetails = [
    {
      name,
      avatar,
      occupation: me.occupation,
      company: me.company_name,
      email: settings.site_email,
      twitter: me.social?.twitter,
      linkedin: me.social?.linkedin,
      github: me.social?.github,
      banner: settings.banner?.src,
      logo: settings.site_logo?.src,
    },
  ];

  return (
    <>
      <BlogSEO
        url={`${settings.site_url}${post.slug}`}
        date={post.publishedAt}
        title={post.title}
        summary={post.excerpt ?? ''}
        lastmod={post.updatedAt}
        images={post.cover_image.src ? [post.cover_image.src] : []}
        slug={post.slug ?? ''}
        tags={
          post.tags?.__typename === 'TagsNode'
            ? post.tags.rows.map((t) => t.name)
            : []
        }
        fileName={post.title}
        site_name={settings.site_title}
        authorDetails={authorDetails}
      />
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

export async function getServerSideProps(context: any) {
  const letterpad = new Letterpad({
    letterpadServer: {
      url: process.env.API_URL!,
      token: process.env.CLIENT_ID!,
      host: context.req.headers.host,
    },
  });

  const post = await letterpad.getPost(context.params.slug.join('/'));
  const settings = await letterpad.getSettings();
  const me = await letterpad.getAuthor();

  return {
    props: {
      post,
      settings,
      me,
    },
  };
}
