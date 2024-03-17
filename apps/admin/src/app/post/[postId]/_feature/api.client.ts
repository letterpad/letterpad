import { InputUpdatePost, PostFilters } from "letterpad-graphql";
import { usePostQuery, useUpdatePostMutation } from "letterpad-graphql/hooks";
import { useCallback, useMemo } from "react";
import { RequestPolicy } from "urql";

import { Message } from "@/components/client-wrapper";

import { debounce } from "@/shared/utils";
import { isPost } from "@/utils/type-guards";

import { WordCount } from "./components/wordCount";

export const useGetPost = (
  filters: PostFilters,
  requestPolicy?: RequestPolicy
) => {
  const [{ data, fetching }, refetch] = usePostQuery({
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
