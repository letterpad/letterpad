import { useCallback, useMemo } from "react";
import { RequestPolicy } from "urql";

import { InputUpdatePost, PostFilters } from "@/__generated__/__types__";
import { useUpdatePostMutation } from "@/__generated__/src/graphql/queries/mutations.graphql";
import { usePostQuery } from "@/__generated__/src/graphql/queries/queries.graphql";
import { debounce } from "@/shared/utils";
import { isPost } from "@/utils/type-guards";

import { WordCount } from "./components/wordCount";
import { Message } from "../../../../components/client-wrapper";

export const useGetPost = (
  filters: PostFilters,
  requestPolicy?: RequestPolicy
) => {
  const [{ data, error, fetching }, refetch] = usePostQuery({
    variables: {
      filters,
    },
    requestPolicy,
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

  const handleUpdatePost = useCallback(
    async (params: InputUpdatePost) => {
      Message().loading({ content: "Saving...", duration: 3 });
      const res = await updatePost({
        data: { ...params },
      });
      Message().success({ content: "Saved", duration: 2 });
      return res;
    },
    [updatePost]
  );

  const debounceUpdatePostAPI = useMemo(
    () => debounce(handleUpdatePost, 500),
    [handleUpdatePost]
  );

  const updatePostWithDebounce = useCallback(
    (props: InputUpdatePost) => {
      let change: InputUpdatePost = { ...props };
      if (props) {
        const stats = WordCount.getStats();
        change = {
          ...change,
          stats,
          id: props.id,
        };
      }
      debounceUpdatePostAPI(change);
    },
    [debounceUpdatePostAPI]
  );

  return {
    fetching,
    updatePost: handleUpdatePost,
    updatePostWithDebounce,
  };
};
