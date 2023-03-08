import { InferGetServerSidePropsType } from 'next';

import { getServerSideProps } from '../../pages/about';

export const About = ({
  settings,
  me,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <div />;
};
