import { InferGetServerSidePropsType } from 'next';

import { getServerSideProps } from '../../pages/tag/[tag]';

export const Tag = ({
  posts,
  me,
  tagName,
  settings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <div>Display a list of posts for the tag {tagName}</div>;
};
