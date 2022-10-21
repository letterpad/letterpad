import { MeFragment, PageFragmentFragment, SettingsFragment } from '@/lib/graphql';

import ScrollTop from '@/components/ScrollTop';
import { BlogSEO } from '@/components/SEO';

import { PhotoStory } from './creatives/photostory';

interface Props {
  data: PageFragmentFragment;
  site_name: string;
  settings: SettingsFragment['settings'];
  me: MeFragment['me'];
}
export default function Creative({ site_name, data, settings, me }: Props) {
  const { slug, publishedAt, title, excerpt, updatedAt, cover_image, tags } = data;
  if (settings.__typename !== 'Setting') return null;
  if (me?.__typename !== 'Author' || data.author?.__typename !== 'Author') return null;
  const authorDetails = [
    {
      name: data.author.name,
      avatar: data.author.avatar,
      occupation: me.occupation,
      company: me.company_name,
      email: settings.site_email,
      twitter: me.social?.twitter,
      linkedin: me.social?.linkedin,
      github: me.social?.github,
      banner: settings.banner?.src,
      logo: settings.site_logo?.src,
    },
  ];
  return (
    <>
      <BlogSEO
        url={`${settings.site_url}${slug}`}
        date={publishedAt}
        title={title}
        summary={excerpt || ''}
        lastmod={updatedAt}
        images={[cover_image?.src ?? '']}
        slug={slug ?? ''}
        tags={tags?.__typename === 'TagsNode' ? tags.rows?.map((t) => t.name) : []}
        fileName={title}
        site_name={site_name}
        //@ts-ignore
        authorDetails={authorDetails}
      />
      <ScrollTop />
      <article>
        <div id="creative">
          <PhotoStory data={data} />
        </div>
      </article>
    </>
  );
}
