import { Letterpad } from 'letterpad-sdk';
import { InferGetServerSidePropsType } from 'next';

import { TagSEO } from '@/components/SEO';

import { useTheme } from '../../themes';

export default function Tag(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { posts, me, tagName, settings } = props;
  const { Tag } = useTheme(settings?.theme);
  if (
    posts.__typename !== 'PostsNode' ||
    settings.__typename !== 'Setting' ||
    me?.__typename !== 'Author'
  ) {
    return null;
  }

  return (
    <>
      <TagSEO
        title={`${tagName} - ${settings.site_title}`}
        description={`${tagName} - Tag of ${settings.site_title}`}
        site_banner={settings.banner?.src}
        site_title={settings.site_title}
        url={settings.site_url + 'tags'}
        twSite={me.social?.twitter}
      />
      <Tag {...props} />
    </>
  );
}

export async function getServerSideProps(context: any) {
  const letterpad = new Letterpad({
    letterpadServer: {
      url: process.env.API_URL!,
      token: process.env.CLIENT_ID!,
      host: context.req.headers.host,
    },
  });

  const posts = await letterpad.listPosts(context.params.tag);
  const settings = await letterpad.getSettings();
  const me = await letterpad.getAuthor();
  const allTags = await letterpad.listTags();

  return {
    props: {
      posts,
      settings,
      me,
      allTags,
      tagName: context.params.tag,
    },
  };
}
