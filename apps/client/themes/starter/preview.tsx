import { Post } from './post';
import { PreviewProps } from '../../types/pageTypes';

export const Preview = ({ post, settings, me }: PreviewProps) => {
  return <Post post={post} settings={settings} me={me} />;
};
