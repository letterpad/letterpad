import { getPreviewData } from '@/data';

import Creative from '@/layouts/Creative';

import { useTheme } from '../../../../themes';

export default async function Preview({ params, searchParams }) {
  const { post, settings, me } = await getPreviewData(params.hash);
  const { Preview } = useTheme(settings?.theme);

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
  return <Preview post={post} settings={settings} me={me} />;
}
