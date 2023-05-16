import { getTagsData } from '../../src/data';

export const Tags = ({
  tags,
  me,
  settings,
}: Awaited<ReturnType<typeof getTagsData>>) => {
  return <div>Display a list of cliclable tags</div>;
};
