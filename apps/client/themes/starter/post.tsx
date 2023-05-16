import Comments from '@/components/comments';

import { getPostData } from '../../src/data';

export const Post = ({
  post,
  settings,
  me,
}: Awaited<ReturnType<typeof getPostData>>) => {
  const { slug, publishedAt, title, excerpt, tags, author, type, sub_title } =
    post;
  const isPage = type === 'page';
  const isPost = type === 'post';

  return (
    <div>
      The user wants to display a post or a page. Dont forget to add the
      comments component for posts.
      {type === 'post' && <Comments provider="utterances" />}
    </div>
  );
};
