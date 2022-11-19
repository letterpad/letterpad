import { useCallback } from "react";

import { InputUpdatePost, PostStatusOptions } from "@/__generated__/__types__";
import { useUpdatePostMutation } from "@/__generated__/queries/mutations.graphql";
import {
  PostDocument,
  PostsDocument,
  StatsDocument,
  StatsQueryResult,
} from "@/__generated__/queries/queries.graphql";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";

export const useUpdatePost = () => {
  const [updatePostMutation, progress] = useUpdatePostMutation();

  const updatePostAPI = useCallback(
    async (data: InputUpdatePost) => {
      return await updatePostMutation({
        variables: {
          data,
        },
      });
    },
    [updatePostMutation],
  );

  async function updatePost(data: InputUpdatePost) {
    return await updatePostMutation({
      variables: {
        data,
      },
      update: (cache, response) => {
        if (data.status === PostStatusOptions.Trashed) {
          const normalizedId = cache.identify({
            __typename: "Post",
            id: data.id,
          });
          cache.evict({ id: normalizedId });
          cache.gc();
        } else {
          cache.writeQuery({
            query: PostDocument,
            variables: { filters: { id: data.id } },
            data: {
              post: response.data?.updatePost,
            },
          });
        }

        const stats = cache.readQuery<StatsQueryResult["data"]>({
          query: StatsDocument,
          variables: {},
        });
        if (stats?.stats?.__typename !== "Stats") return;
        let published = stats?.stats?.posts?.published;
        if (data.status === PostStatusOptions.Trashed) {
          published -= 1;
        } else if (data.status === PostStatusOptions.Published) {
          published += 1;
        } else if (data.status === PostStatusOptions.Draft) {
          // published -= 1;
        }

        cache.writeQuery({
          query: StatsDocument,
          data: {
            stats: {
              ...stats?.stats,
              posts: {
                ...(stats?.stats?.posts ?? {}),
                published,
              },
            },
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
            ...(postData?.post || {}),
            ...cache.data,
          },
        };
      },
    });
  }

  const updateLocalState = (data: InputUpdatePost) => {
    const postData = apolloBrowserClient.readQuery({
      query: PostDocument,
      variables: { filters: { id: data.id } },
    });
    const post = {
      ...postData.post,
      ...data,
      stats: {
        ...postData.post?.stats,
        ...data.stats,
      },
    };

    apolloBrowserClient.writeQuery({
      query: PostDocument,
      variables: { filters: { id: data.id } },
      data: {
        post,
      },
    });
  };

  return { updatePost, progress, updateLocalState, updatePostAPI };
};
