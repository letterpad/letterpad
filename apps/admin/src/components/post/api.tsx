import { debounce, removeTypenames } from "src/shared/utils";

import { InputUpdatePost, Post } from "@/__generated__/__types__";
import {
  UpdatePostDocument,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from "@/__generated__/queries/mutations.graphql";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";
import { EventAction, track } from "@/track";

const updatePostRequest = async (
  attrs: Omit<InputUpdatePost, "id">,
  postId: number,
) => {
  track({
    eventAction: EventAction.Change,
    eventCategory: "post",
    eventLabel: Object.keys(attrs).join("-"),
  });
  return apolloBrowserClient.mutate<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >({
    mutation: UpdatePostDocument,
    variables: {
      data: { ...removeTypenames(attrs), id: postId },
    },
  });
};
const debounceUpdatePost = debounce(updatePostRequest, 1000);

export const updatePostApi = async (
  attrs: Omit<InputUpdatePost, "id">,
  id: Post["id"],
) => {
  await debounceUpdatePost(attrs, id);
};
