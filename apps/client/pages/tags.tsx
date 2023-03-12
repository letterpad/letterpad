import { Letterpad } from 'letterpad-sdk';
import { InferGetServerSidePropsType } from 'next';

import { BaseSEO } from '@/components/SEO';

import { useTheme } from '../themes';

export default function Tags(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { tags, me, settings } = props;
  const { Tags } = useTheme(settings?.theme);

  if (
    me?.__typename !== 'Author' ||
    tags.__typename !== 'TagsNode' ||
    settings.__typename !== 'Setting'
  )
    return null;
  return (
    <>
      <BaseSEO
        title={`Tags - ${me.name}`}
        description="Things I blog about"
        site_banner={settings.banner?.src}
        site_title={settings.site_title}
        url={settings.site_url}
        twSite={me.social?.twitter}
      />
      <Tags {...props} />
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const letterpad = new Letterpad({
    letterpadServer: {
      url: process.env.API_URL!,
      token: process.env.CLIENT_ID!,
      host: context.req.headers.host,
    },
  });
  const tags = await letterpad.listTags();
  const settings = await letterpad.getSettings();
  const me = await letterpad.getAuthor();

  return {
    props: {
      tags,
      settings,
      me,
    },
  };
};
