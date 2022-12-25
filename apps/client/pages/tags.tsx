import { Letterpad } from 'letterpad-sdk';
import { InferGetServerSidePropsType } from 'next';

import kebabCase from '@/lib/utils/kebabCase';

import Link from '@/components/Link';
import PageTitle from '@/components/PageTitle';
import SectionContainer from '@/components/SectionContainer';
import { PageSEO } from '@/components/SEO';
import Tag from '@/components/Tag';

export default function Tags({
  tags,
  me,
  settings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (
    me?.__typename !== 'Author' ||
    tags.__typename !== 'TagsNode' ||
    settings.__typename !== 'Setting'
  )
    return null;

  return (
    <>
      <PageSEO
        title={`Tags - ${me.name}`}
        description="Things I blog about"
        site_banner={settings.banner?.src}
        site_title={settings.site_title}
        url={settings.site_url}
        twSite={me.social?.twitter}
      />
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <PageTitle>Tags</PageTitle>
        </div>
        <SectionContainer>
          <div className="flex max-w-lg flex-wrap">
            {Object.keys(tags).length === 0 && 'No tags found.'}
            {tags.rows.map((t) => {
              const count =
                t.posts?.__typename === 'PostsNode' ? t.posts.count : 0;
              return (
                <div key={t.name} className="mt-2 mb-2 mr-5">
                  <Tag text={t.name} />
                  <Link
                    href={`/tag/${kebabCase(t.name)}`}
                    className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
                  >
                    {`(${count})`}
                  </Link>
                </div>
              );
            })}
          </div>
        </SectionContainer>
      </div>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const letterpad = new Letterpad({
    letterpadServer: {
      url: process.env.API_URL!,
      token: process.env.CLIENT_ID!,
      host: context.req.headers.host,
    },
  });
  const tags = await letterpad.listTags();
  const settings = await letterpad.getSettings();
  const me = await letterpad.getAuthor();

  return {
    props: {
      tags,
      settings,
      me,
    },
  };
};
