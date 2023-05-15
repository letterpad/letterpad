import { getPostsByTag } from '../../src/data';

export const Tag = ({
  posts,
  me,
  tagName,
  settings,
}: Awaited<ReturnType<typeof getPostsByTag>>) => {
  return <div>Display a list of posts for the tag {tagName}</div>;
};
