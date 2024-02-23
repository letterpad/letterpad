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

const createCommentQuery = gql`
  mutation createComment(
    $post_id: Int!
    $content: String!
    $parent_id: String
  ) {
    createComment(post_id: $post_id, content: $content, parent_id: $parent_id) {
      ... on Comment {
        id
        content
        createdAt
        replies {
          id
          content
          createdAt
          author {
            id
            name
            avatar
            username
          }
        }
        author {
          id
          name
          avatar
          username
        }
      }
      ... on CommentError {
        message
      }
    }
  }
`;

const comments = gql`
  query Comments($post_id: Int!) {
    comments(post_id: $post_id) {
      id
      content
      createdAt
      replies {
        id
        content
        createdAt
        author {
          id
          name
          avatar
          username
        }
      }
      author {
        id
        name
        avatar
        username
      }
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

export const postComment = async (
  post_id: number,
  content: string,
  parent_id: string = ''
) => {
  const url = new URL('/redirect-api/graphql', window.location.href);
  const req = await fetch(url.href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: print(createCommentQuery),
      variables: {
        post_id,
        content,
        parent_id,
      },
    }),
  });
  const data = await req.json();
  return data.data;
};

export const getComments = async (post_id: number) => {
  const url = new URL('/redirect-api/graphql', window.location.href);
  const req = await fetch(url.href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: print(comments),
      variables: {
        post_id,
      },
    }),
  });
  const data = await req.json();
  return data.data;
};
