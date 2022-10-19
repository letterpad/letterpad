import gql from 'graphql-tag';
import { InferGetServerSidePropsType } from 'next';
import { meFragment, pageFragment, settingsFragment } from 'queries/queries';

import { fetchProps } from '@/lib/client';
import { PageQueryWithHtmlQuery, PageQueryWithHtmlQueryVariables } from '@/lib/graphql';

import PostLayout from '@/layouts/PostLayout';

const pageQueryWithHtml = gql`
  query PageQueryWithHtml($slug: String) {
    post(filters: { slug: $slug }) {
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
  if (post.__typename === 'Post' && settings.__typename === 'Setting') {
    return (
      <PostLayout data={{ post, settings, me }}>
        <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
      </PostLayout>
    );
  }
  return null;
}

export async function getServerSideProps(context) {
  const response = await fetchProps<PageQueryWithHtmlQuery, PageQueryWithHtmlQueryVariables>(
    pageQueryWithHtml,
    {
      slug: context.params.slug.join('/'),
    },
    context.req.headers.host
  );

  return {
    props: response.props.data,
  };
}
