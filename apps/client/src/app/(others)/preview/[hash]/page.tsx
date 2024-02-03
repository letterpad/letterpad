export const runtime = 'edge';

import { getPreviewData } from '@/data';

import Creative from '@/layouts/Creative';

import Custom404 from '../../../not-found';
import { Post } from '../../../../features/post/post';

export default async function Preview({ params, searchParams }) {
  const data = await getPreviewData(params.hash);
  if (!data?.post || !data?.settings || !data?.me) {
    return <Custom404 />;
  }
  const { post, settings, me } = data;

  if (post.__typename !== 'Post' || settings.__typename !== 'Setting') {
    return null;
  }
  if (post.author?.__typename !== 'Author') return null;
  if (post.page_type === 'zigzag') {
    return (
      <Creative
        data={post}
        site_name={settings.site_title}
        settings={settings}
        me={me}
      />
    );
  }
  return <Post post={post} settings={settings} me={me} />;
}
