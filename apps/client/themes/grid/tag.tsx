import { List } from './commons/list';
import { SectionContainer } from './commons/section';
import { PageTitle } from './commons/title';
import { TagProps } from '../../types/pageTypes';

export const Tag = ({
  posts,
  me: _me,
  tagName,
  settings: _settings,
}: TagProps) => {
  return (
    <>
      <SectionContainer>
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <PageTitle>{tagName}</PageTitle>
        </div>
      </SectionContainer>
      <List posts={posts} />
    </>
  );
};
