import { InferGetServerSidePropsType } from 'next';

import { getServerSideProps } from '../../src/app/about/page';

export const About = ({
  settings,
  me,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <div />;
};
