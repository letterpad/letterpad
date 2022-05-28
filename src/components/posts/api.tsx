import { PostsFilters, PostTypes } from "@/__generated__/__types__";
import {
  PostsDocument,
  PostsQuery,
  PostsQueryVariables,
} from "@/__generated__/queries/queries.graphql";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";

export const fetchPosts = async (
  type: PostTypes = PostTypes.Post,
  args = {},
) => {
  const posts = await fetchPostsFromAPI(args, type);

  if (posts.__typename === "PostsNode") {
    const rows = posts.rows.map((post) => {
      return {
        ...post,
        key: post.id,
      };
    });
    return { ...posts, rows };
  }

  if (posts.__typename === "PostError") {
    throw new Error(posts.message);
  }
};

async function fetchPostsFromAPI(filters: PostsFilters, type: PostTypes) {
  const post = await apolloBrowserClient.query<PostsQuery, PostsQueryVariables>(
    {
      query: PostsDocument,
      variables: {
        filters: {
          type,
          ...filters,
        },
      },
      fetchPolicy: "network-only",
    },
  );
  return post.data.posts;
}
