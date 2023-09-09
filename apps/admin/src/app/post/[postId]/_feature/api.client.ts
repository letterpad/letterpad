import { useState } from "react";

import { InputUpdatePost, PostFilters } from "@/__generated__/__types__";
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
  const [updating, setUpdating] = useState(false);
  return {
    fetching,
    updating,
    updatePost: (params: InputUpdatePost) => {
      setUpdating(true);
      const res = updatePost({
        data: { ...params },
      });
      setUpdating(false);
      return res;
    },
  };
};
