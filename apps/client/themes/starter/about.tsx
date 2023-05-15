import { InferGetServerSidePropsType } from 'next';

import { getAbout } from '../../src/data';

export const About = ({
  settings,
  me,
}: Awaited<ReturnType<typeof getAbout>>) => {
  return <div />;
};
