import gql from 'graphql-tag';
import { Letterpad } from 'letterpad-sdk';
import { InferGetServerSidePropsType } from 'next';
import { useEffect } from 'react';

import Creative from '@/layouts/Creative';

import { useTheme } from '../../themes';

export default function Preview({
  post,
  settings,
  me,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { Post } = useTheme({
    theme: settings.theme === 'minimal' ? 'list' : 'grid',
  });

  useEffect(() => {
    if (typeof window.Prism !== 'undefined') {
      window.Prism.highlightAll();
    }
  }, [post]);

  if (post.__typename !== 'Post' || settings.__typename !== 'Setting') {
    return null;
  }
  if (post.author?.__typename !== 'Author') return null;
  if (post.page_type === 'zigzag') {
    return (
      <Creative
        data={post}
        site_name={settings.site_title}
        settings={settings}
        me={me}
      />
    );
  }
  return <Post post={post} settings={settings} me={me} />;
}

export async function getServerSideProps(context: any) {
  const letterpad = new Letterpad({
    letterpadServer: {
      url: process.env.API_URL!,
      token: process.env.CLIENT_ID!,
      host: context.req.headers.host,
    },
  });
  const post = await letterpad.getPost({
    previewHash: context.params.hash,
  });
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
