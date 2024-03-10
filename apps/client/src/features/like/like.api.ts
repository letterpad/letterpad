import { print } from 'graphql';
import gql from 'graphql-tag';

const query = gql`
  query isPostLiked($postId: String!) {
    isPostLiked(postId: $postId) {
      ok
      liked
      message
    }
  }
`;

export const hasLiked = async (postId: string) => {
  const url = new URL('/redirect-api/graphql', window.location.href);
  const req = await fetch(url.href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: print(query),
      variables: {
        postId,
      },
    }),
    next: {
      tags: [`like-post-${postId}`],
    },
  });
  const data = await req.json();
  return data?.data?.isPostLiked?.liked;
};

export const likePost = async (postId: string) => {
  const url = new URL('/redirect-api/events/like', window.location.href);
  const params = new URLSearchParams({
    id: postId.toString(),
    type: 'post',
  });
  url.search = params.toString();
  const req = await fetch(url.href);
  const data = await req.json();
  return data.data;
};
