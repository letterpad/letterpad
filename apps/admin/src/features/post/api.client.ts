import { useMutation, useQuery } from "urql";

import { PostFilters } from "@/__generated__/__types__";
import { UpdatePostDocument } from "@/__generated__/src/graphql/queries/mutations.graphql";
import {
  PostDocument,
  PostQuery,
} from "@/__generated__/src/graphql/queries/queries.graphql";
import { UpdatePostMutation } from "@/graphql/queries/mutations.graphql";
import { isPost } from "@/utils/type-guards";

export const useGetPost = (filters: PostFilters) => {
  const [{ data, error, fetching }] = useQuery<PostQuery>({
    query: PostDocument,
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
  const [{ fetching }, updatePost] =
    useMutation<UpdatePostMutation>(UpdatePostDocument);
  return {
    fetching,
    updatePost: (params) => {
      return updatePost({
        data: { ...params },
      });
    },
  };
};
