import { ReactNode } from 'react';

import { MeFragment, PageFragmentFragment, SettingsFragment } from '@/lib/graphql';
import formatDate from '@/lib/utils/formatDate';

import Link from '@/components/Link';
import PageTitle from '@/components/PageTitle';
// import Comments from '@/components/comments';
import ScrollTop from '@/components/ScrollTop';
import SectionContainer from '@/components/SectionContainer';
import { BlogSEO } from '@/components/SEO';

interface Props {
  data: PageFragmentFragment;
  children: ReactNode;
  next?: { slug: string; title: string };
  prev?: { slug: string; title: string };
  site_name: string;
  settings: SettingsFragment['settings'];
  me: MeFragment['me'];
}
export default function PostSimple({ site_name, data, next, prev, children, settings, me }: Props) {
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
    <SectionContainer>
      <BlogSEO
        url={`${settings.site_url}${slug}`}
        date={publishedAt}
        title={title}
        summary={excerpt ?? ''}
        lastmod={updatedAt}
        images={cover_image.src ? [cover_image.src] : []}
        slug={slug ?? ''}
        tags={tags?.__typename === 'TagsNode' ? tags.rows.map((t) => t.name) : []}
        fileName={title}
        site_name={site_name}
        authorDetails={authorDetails}
      />
      <ScrollTop />
      <article>
        <div>
          <header>
            <div className="space-y-1 border-b border-gray-200 py-10 text-center dark:border-gray-700">
              <dl>
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:divide-y-0 "
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pt-10 pb-8 dark:prose-dark">{children}</div>
            </div>
            {/* <Comments frontMatter={frontMatter} /> */}
            <footer>
              <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                {prev && (
                  <div className="pt-4 xl:pt-8">
                    <Link href={`/blog/${prev.slug}`} className="link">
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {next && (
                  <div className="pt-4 xl:pt-8">
                    <Link href={`/blog/${next.slug}`} className="link">
                      {next.title} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  );
}
