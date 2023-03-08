import { InferGetServerSidePropsType } from 'next';

import { getServerSideProps } from '../../pages/tags';

export const Tag = ({
  tags,
  me,
  settings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <div>Display a list of cliclable tags</div>;
};
