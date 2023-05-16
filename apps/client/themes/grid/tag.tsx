import { InferGetServerSidePropsType } from 'next';

import { List } from './commons/list';
import { SectionContainer } from './commons/section';
import { PageTitle } from './commons/title';
import { getPostsByTag } from '../../src/data';

export const Tag = ({
  posts,
  me: _me,
  tagName,
  settings: _settings,
}: Awaited<ReturnType<typeof getPostsByTag>>) => {
  return (
    <>
      <SectionContainer>
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <PageTitle>{tagName}</PageTitle>
        </div>
      </SectionContainer>
      <List posts={posts} />
    </>
  );
};
