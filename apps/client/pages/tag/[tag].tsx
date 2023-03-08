import { Letterpad } from 'letterpad-sdk';
import { InferGetServerSidePropsType } from 'next';

import PageTitle from '@/components/PageTitle';
import SectionContainer from '@/components/SectionContainer';
import { TagSEO } from '@/components/SEO';

import ListLayout from '@/layouts/ListLayout';

export default function Tag({
  posts,
  me,
  tagName,
  settings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (
    posts.__typename !== 'PostsNode' ||
    settings.__typename !== 'Setting' ||
    me?.__typename !== 'Author'
  ) {
    return null;
  }

  return (
    <>
      <TagSEO
        title={`${tagName} - ${settings.site_title}`}
        description={`${tagName} - Tag of ${settings.site_title}`}
        site_banner={settings.banner?.src}
        site_title={settings.site_title}
        url={settings.site_url + 'tags'}
        twSite={me.social?.twitter}
      />
      <SectionContainer>
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <PageTitle>{tagName}</PageTitle>
        </div>
      </SectionContainer>
      <ListLayout posts={posts} />
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

  const posts = await letterpad.listPosts(context.params.tag);
  const settings = await letterpad.getSettings();
  const me = await letterpad.getAuthor();

  return {
    props: {
      posts,
      settings,
      me,
      tagName: context.params.tag,
    },
  };
}
