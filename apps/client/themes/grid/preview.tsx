import { Post } from './post';
import { getPreviewData } from '../../src/data';

export const Preview = ({
  post,
  settings,
  me,
}: Awaited<ReturnType<typeof getPreviewData>>) => {
  return <Post post={post} settings={settings} me={me} />;
};
