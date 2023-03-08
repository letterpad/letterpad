import { InferGetServerSidePropsType } from 'next';

import { Post } from './post';
import { getServerSideProps } from '../../pages/preview/[hash]';

export const Preview = ({
  post,
  settings,
  me,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <Post post={post} settings={settings} me={me} />;
};
