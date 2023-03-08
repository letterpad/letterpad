import { Letterpad } from 'letterpad-sdk';
import { InferGetServerSidePropsType } from 'next';

import PostLayout from '@/layouts/PostLayout';

export default function Blog({
  post,
  settings,
  me,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
