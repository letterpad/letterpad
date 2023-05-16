import Creative from '@/layouts/Creative';

import { useTheme } from '../../../../themes';
import { getPreviewData } from '../../../data';

export default async function Preview() {
  const { post, settings, me } = await getPreviewData('');
  const { Post } = useTheme(settings?.theme);

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
