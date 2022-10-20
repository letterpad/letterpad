import gql from 'graphql-tag';
import { InferGetServerSidePropsType } from 'next';
import { meFragment, postsFragment, settingsFragment, tagsFragment } from 'queries/queries';

import { fetchProps } from '@/lib/client';
import { TagPostsQueryQuery, TagPostsQueryQueryVariables } from '@/lib/graphql';

import { TagSEO } from '@/components/SEO';

import ListLayout from '@/layouts/ListLayout';

export const tagsQuery = gql`
  query TagPostsQuery($tagSlug: String!) {
    posts(filters: { tagSlug: $tagSlug }) {
      ...postsFragment
    }
    tag(slug: $tagSlug) {
      ...tagsFragment
    }
    ...me
    ...settings
  }
  ${tagsFragment}
  ${postsFragment}
  ${meFragment}
  ${settingsFragment}
`;

export default function Tag({
  posts,
  me,
  tagName,
  settings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // Capitalize first letter and convert space to dash
  // const title = tagName[0].toUpperCase() + tagName.split(' ').join('-').slice(1);
  if (
    posts.__typename !== 'PostsNode' ||
    settings.__typename !== 'Setting' ||
    me.__typename !== 'Author'
  ) {
    return null;
  }

  return (
    <>
      <TagSEO
        title={`${tagName} - ${settings.site_title}`}
        description={`${tagName} - Tag of ${settings.site_title}`}
        site_banner={settings.banner.src}
        site_title={settings.site_title}
        url={settings.site_url + 'tags'}
        twSite={me.social.twitter}
      />
      <ListLayout posts={posts} title={tagName} />
    </>
  );
}

export async function getServerSideProps(context) {
  const response = await fetchProps<TagPostsQueryQuery, TagPostsQueryQueryVariables>(
    tagsQuery,
    { tagSlug: context.params.tag },
    context.req.headers.host
  );
  return {
    props: { ...response.props.data, tagName: context.params.tag },
  };
}
