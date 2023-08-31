import { PostFilters } from "@/__generated__/__types__";
import { useUpdatePostMutation } from "@/__generated__/src/graphql/queries/mutations.graphql";
import { usePostQuery } from "@/__generated__/src/graphql/queries/queries.graphql";
import { isPost } from "@/utils/type-guards";

export const useGetPost = (filters: PostFilters) => {
  const [{ data, error, fetching }] = usePostQuery({
    variables: {
      filters,
    },
    pause: !filters.id,
  });
  const post = isPost(data?.post) ? data?.post : undefined;

  return {
    data: post,
    fetching,
  };
};

export const useUpdatePost = () => {
  const [{ fetching }, updatePost] = useUpdatePostMutation();
  return {
    fetching,
    updatePost: (params) => {
      return updatePost({
        data: { ...params },
      });
    },
  };
};
