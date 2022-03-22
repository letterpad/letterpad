import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";
import { EventAction, track } from "@/track";
import {
  UpdatePostDocument,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from "@/__generated__/queries/mutations.graphql";
import { PostWithAuthorAndTagsFragment } from "@/__generated__/queries/partial.graphql";
import {
  PostDocument,
  PostQuery,
  PostQueryVariables,
} from "@/__generated__/queries/queries.graphql";
import {
  InputUpdatePost,
  Post,
  PostStatusOptions,
} from "@/__generated__/__types__";
import { debounce, removeTypenames } from "src/shared/utils";

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

export async function getPost(postId: number) {
  const post = await apolloBrowserClient.query<PostQuery, PostQueryVariables>({
    query: PostDocument,
    variables: {
      filters: {
        id: postId,
      },
    },
  });
  return post.data.post;
}

export const updatePostDraftAttributes = (
  attrs: Omit<InputUpdatePost, "id">,
  post: PostWithAuthorAndTagsFragment,
) => {
  // if post is already published and new content is added, then save this as draft
  if (post.status === PostStatusOptions.Published && attrs.html) {
    return { ...post, html_draft: attrs.html };
  }
  // if the post is published or republished, remove draft
  else if (attrs.status === PostStatusOptions.Published) {
    return { ...post, ...attrs, html_draft: "", html: post.html_draft };
  }
  // save the other attributes of post
  else {
    return { ...post, ...attrs };
  }
};
