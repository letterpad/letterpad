import { useCallback } from "react";

import { InputUpdatePost } from "@/__generated__/__types__";
import { useUpdatePostMutation } from "@/__generated__/queries/mutations.graphql";
import { PostDocument } from "@/__generated__/queries/queries.graphql";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";
import { debounce } from "@/shared/utils";

export const useUpdatePost = () => {
  const [updatePostMutation, progress] = useUpdatePostMutation();

  function updatePost(data: InputUpdatePost) {
    return updatePostMutation({
      variables: {
        data,
      },
      update: (cache, response) => {
        cache.writeQuery({
          query: PostDocument,
          variables: { filters: { id: data.id } },
          data: {
            post: response.data?.updatePost,
          },
        });
      },
      optimisticResponse: (cache) => {
        const postData = apolloBrowserClient.readQuery({
          query: PostDocument,
          variables: { filters: { id: data.id } },
        });
        return {
          updatePost: {
            ...postData.post,
            ...cache.data,
          },
        };
      },
    });
  }

  const d = useCallback(debounce(updatePost, 500), []);

  const debounceUpdatePost = (data: InputUpdatePost) => {
    updateLocalState(data);
    d(data);
  };

  const updateLocalState = (data: InputUpdatePost) => {
    const postData = apolloBrowserClient.readQuery({
      query: PostDocument,
      variables: { filters: { id: data.id } },
    });
    const post = {
      ...postData.post,
      ...data,
    };

    apolloBrowserClient.writeQuery({
      query: PostDocument,
      variables: { filters: { id: data.id } },
      data: {
        post,
      },
    });
  };

  return { updatePost, progress, debounceUpdatePost, updateLocalState };
};
