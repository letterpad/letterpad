import {
  InputUpdatePost,
  PostFilters,
  PostWithAuthorAndTagsFragment,
} from "letterpad-graphql";
import { usePostQuery, useUpdatePostMutation } from "letterpad-graphql/hooks";
import { useCallback, useMemo } from "react";
import { RequestPolicy } from "urql";

import { Message } from "@/components/client-wrapper";

import { debounce } from "@/shared/utils";
import { isPost } from "@/utils/type-guards";

import { WordCount } from "./components/wordCount";
import { usePostContext } from "./context";

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
  const post = isPost(data?.post) ? data.post : undefined;

  return {
    data: post as unknown as PostWithAuthorAndTagsFragment | undefined,
    fetching,
    refetch,
  };
};

export const useUpdatePost = () => {
  const [, updatePost] = useUpdatePostMutation();
  const { setSaving, saving } = usePostContext();

  const handleUpdatePost = useCallback(
    async (params: InputUpdatePost, savingIndicator = true) => {
      if (savingIndicator) {
        Message().loading({ content: "Saving...", duration: 3 });
      } else {
        setSaving?.(true);
      }

      const res = await updatePost({
        data: { ...params },
      });
      setSaving?.(false);
      if (res.data?.updatePost.__typename.endsWith("Error")) {
        Message().error({
          content: (res.data.updatePost as any).message,
          duration: 3,
        });
        return res;
      }
      if (res.error) {
        Message().error({ content: res.error.message, duration: 3 });
        return res;
      }
      if (savingIndicator) {
        Message().success({ content: "Saved", duration: 2 });
      }
      return res;
    },
    [setSaving, updatePost]
  );

  const debounceUpdatePostAPI = useMemo(
    () => debounce(handleUpdatePost, 500),
    [handleUpdatePost]
  );

  const updatePostWithDebounce = useCallback(
    (props: InputUpdatePost, savingIndicator?: boolean) => {
      let change: InputUpdatePost = { ...props };
      if (props) {
        const stats = WordCount.getStats();
        change = {
          ...change,
          stats,
          id: props.id,
        };
      }
      return debounceUpdatePostAPI(change, savingIndicator);
    },
    [debounceUpdatePostAPI]
  );

  return {
    fetching: saving,
    updatePost: handleUpdatePost,
    updatePostWithDebounce,
  };
};
