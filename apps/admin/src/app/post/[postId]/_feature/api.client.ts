import { useCallback, useMemo } from "react";

import { InputUpdatePost, PostFilters } from "@/__generated__/__types__";
import { useUpdatePostMutation } from "@/__generated__/src/graphql/queries/mutations.graphql";
import { usePostQuery } from "@/__generated__/src/graphql/queries/queries.graphql";
import { isPost } from "@/utils/type-guards";

import { WordCount } from "./components/wordCount";
import { useActivateUpdateAllowed } from "./hooks";
import { debounce } from "../../../../shared/utils";

export const useGetPost = (filters: PostFilters) => {
  const [{ data, error, fetching }, refetch] = usePostQuery({
    variables: {
      filters,
    },
    pause: !filters.id,
  });
  const post = isPost(data?.post) ? data?.post : undefined;

  return {
    data: post,
    fetching,
    refetch,
  };
};

export const useUpdatePost = () => {
  const [{ fetching }, updatePost] = useUpdatePostMutation();
  const allowed = useActivateUpdateAllowed();

  const handleUpdatePost = useCallback(
    (params: InputUpdatePost) => {
      return updatePost({
        data: { ...params },
      });
    },
    [updatePost]
  );

  const debounceUpdatePostAPI = useMemo(
    () => debounce(handleUpdatePost, 1000),
    [handleUpdatePost]
  );

  const updatePostWithDebounce = useCallback(
    (props: InputUpdatePost) => {
      let change: InputUpdatePost = { ...props };
      if (props.version) {
        const stats = WordCount.getStats();
        change = {
          version: props.version,
          stats,
          id: props.id,
        };
      }
      allowed && debounceUpdatePostAPI(change);
    },
    [debounceUpdatePostAPI, allowed]
  );

  return {
    fetching,
    updatePost: handleUpdatePost,
    updatePostWithDebounce,
  };
};
