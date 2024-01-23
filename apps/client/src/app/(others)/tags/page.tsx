export const runtime = 'edge';

import { getTagsData } from '@/data';

import { BaseSEO } from '@/components/SEO';

import Custom404 from '../../not-found';
import { PageTitle } from '../../../components/title';
import { SectionContainer } from '../../../components/section';

import kebabCase from '@/lib/utils/kebabCase';

import Link from '@/components/Link';
import Tag from '@/components/Tag';

export default async function Tags() {
  const data = await getTagsData();
  if (!data?.tags || !data?.settings || !data?.me) {
    return <Custom404 homepage="https://letterpad.app" />;
  }
  const { tags, settings, me } = data;

  if (
    me?.__typename !== 'Author' ||
    tags.__typename !== 'TagsNode' ||
    settings.__typename !== 'Setting'
  )
    return null;
  return (
    <>
      <BaseSEO
        title={`Tags - ${me.name}`}
        description="Things I blog about"
        site_banner={settings.banner?.src}
        site_title={settings.site_title}
        url={settings.site_url}
        twSite={me.social?.twitter}
      />
      <>
        <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
          <div className="space-x-2 pb-8 pt-6 md:space-y-5">
            <PageTitle>Tags</PageTitle>
          </div>
          <SectionContainer>
            <div className="flex max-w-lg flex-wrap">
              {Object.keys(tags).length === 0 && 'No tags found.'}
              {tags.rows.map((t) => {
                const count =
                  t.posts?.__typename === 'PostsNode' ? t.posts.count : 0;
                return (
                  <div key={t.name} className="mb-2 mr-5 mt-2">
                    <Tag text={t.name} />
                    <Link
                      href={`/tag/${kebabCase(t.name)}`}
                      className="-ml-2 text-sm font-semibold uppercase text-gray-600 hover:text-accent-50 dark:text-gray-300"
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
    </>
  );
}
