import { InferGetServerSidePropsType } from 'next';

import kebabCase from '@/lib/utils/kebabCase';

import Link from '@/components/Link';
import Tag from '@/components/Tag';

import { SectionContainer } from './commons/section';
import { PageTitle } from './commons/title';
import { getServerSideProps } from '../../pages/tags';

export const Tags = ({
  tags,
  me,
  settings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
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
  );
};
