import gql from 'graphql-tag';
import { InferGetServerSidePropsType } from 'next';
import { meFragment, pageFragment, settingsFragment } from 'queries/queries';

import { fetchProps } from '@/lib/client';
import { PreviewQueryQuery, PreviewQueryQueryVariables } from '@/lib/graphql';

import Creative from '@/layouts/Creative';
import PostLayout from '@/layouts/PostLayout';

export const previewQuery = gql`
  query PreviewQuery($previewHash: String) {
    post(filters: { previewHash: $previewHash }) {
      ...pageFragment
      ... on Post {
        html
        author {
          ... on Author {
            name
            avatar
          }
          __typename
        }
      }
      __typename
    }
    ...me
    ...settings
  }
  ${pageFragment}
  ${meFragment}
  ${settingsFragment}
`;

export default function Blog({
  post,
  settings,
  me,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (post.__typename !== 'Post' || settings.__typename !== 'Setting') {
    return null;
  }
  if (post.author.__typename !== 'Author') return null;
  if (post.page_type === 'zigzag') {
    return <Creative data={post} site_name={settings.site_title} settings={settings} me={me} />;
  }
  return (
    <PostLayout data={{ post, settings, me }}>
      <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
    </PostLayout>
  );
}

export async function getServerSideProps(context) {
  const response = await fetchProps<PreviewQueryQuery, PreviewQueryQueryVariables>(
    previewQuery,
    { previewHash: context.params.hash },
    context.req.headers.host
  );
  return {
    props: response.props.data,
  };
}
