import { print } from 'graphql';
import { gql } from 'graphql-tag';

const follow = gql`
  mutation FollowAuthor($username: String!) {
    followAuthor(username: $username) {
      ok
      message
    }
  }
`;

const unFollow = gql`
  mutation UnFollowAuthor($username: String!) {
    unFollowAuthor(username: $username) {
      ok
      message
    }
  }
`;

const stats = gql`
  query IsFollowing($username: String!) {
    isFollowing(username: $username) {
      ok
      following
      message
    }
  }
`;

export const doFollow = async (username: string) => {
  const url = new URL('/redirect-api/graphql', window.location.href);
  const req = await fetch(url.href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: print(follow),
      variables: {
        username,
      },
    }),
  });
  const data = await req.json();
  return data.data;
};

export const doUnFollow = async (username: string) => {
  const url = new URL('/redirect-api/graphql', window.location.href);
  const req = await fetch(url.href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: print(unFollow),
      variables: {
        username,
      },
    }),
  });
  const data = await req.json();
  return data.data;
};

export const getIsFollowing = async (username: string) => {
  const url = new URL('/redirect-api/graphql', window.location.href);
  const req = await fetch(url.href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: print(stats),
      variables: {
        username,
      },
    }),
  });
  const data = await req.json();
  return data.data;
};
