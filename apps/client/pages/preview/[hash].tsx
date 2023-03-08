import gql from 'graphql-tag';
import { Letterpad } from 'letterpad-sdk';
import { InferGetServerSidePropsType } from 'next';

import Creative from '@/layouts/Creative';
import PostLayout from '@/layouts/PostLayout';

export default function Preview({
  post,
  settings,
  me,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
  return (
    <PostLayout data={{ post, settings, me }}>
      <div dangerouslySetInnerHTML={{ __html: post.html ?? '' }}></div>
    </PostLayout>
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
