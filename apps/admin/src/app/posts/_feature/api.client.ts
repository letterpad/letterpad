import {
  InputAuthor,
  InputCreatePost,
  PostsFilters,
} from "@/__generated__/__types__";
import {
  useCreatePostMutation,
  useUpdateAuthorMutation,
} from "@/__generated__/src/graphql/queries/mutations.graphql";
import {
  usePostsQuery,
  useStatsQuery,
} from "@/__generated__/src/graphql/queries/queries.graphql";

import { isAuthor, isPostsNode, isStats } from "../../../utils/type-guards";

export const useUpdateAuthor = () => {
  const [{ data, fetching, error }, updateAuthor] = useUpdateAuthorMutation();
  return {
    fetching,
    error,
    data: isAuthor(data) ? data : undefined,
    updateAuthor: async (change: InputAuthor) => {
      const result = await updateAuthor({
        author: {
          ...change,
        },
      });
      return result;
    },
  };
};
export const useCreatePost = () => {
  const [{ fetching, error }, createPost] = useCreatePostMutation();
  return {
    fetching,
    error,
    createPost: async (change: InputCreatePost) => {
      const result = await createPost({
        data: change,
      });
      return result;
    },
  };
};

export const useGetPosts = (
  variables: PostsFilters = {},
  options = { skip: false }
) => {
  const [{ fetching, data, error }, refetch] = usePostsQuery({
    variables: {
      filters: variables,
    },
    pause: options.skip,
  });
  const postsNode = isPostsNode(data?.posts) ? data?.posts.rows : [];
  return {
    fetching,
    error,
    data: postsNode,
    refetch,
  };
};

export const useGetStats = (variables = {}, options = { skip: false }) => {
  const [{ fetching, data, error }, refetch] = useStatsQuery({
    pause: options.skip,
    variables,
  });

  return {
    fetching,
    error,
    data: isStats(data?.stats) ? data?.stats : undefined,
    refetch,
  };
};
