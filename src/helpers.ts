import {
  UpdateMediaMutationVariables,
  UpdateMediaDocument,
} from "./../__generated__/src/graphql/queries/mutations.graphql";

import {
  DeleteMediaDocument,
  DeleteMediaMutation,
  DeleteMediaMutationVariables,
  UpdateMediaMutation,
} from "@/__generated__/queries/mutations.graphql";
import { Media } from "@/__generated__/__types__";
import { apolloBrowserClient } from "./graphql/apolloBrowserClient";

export const deleteImageAPI = async (img: Media) => {
  const response = await apolloBrowserClient.mutate<
    DeleteMediaMutation,
    DeleteMediaMutationVariables
  >({
    mutation: DeleteMediaDocument,
    variables: {
      ids: [img.id],
    },
  });
  return response;
};

export const updateImageAPI = async (img: Media) => {
  if (!img) return;

  const response = await apolloBrowserClient.mutate<
    UpdateMediaMutation,
    UpdateMediaMutationVariables
  >({
    mutation: UpdateMediaDocument,
    variables: {
      data: {
        id: img.id,
        description: img.description,
        name: img.name,
      },
    },
  });
  const update = response.data?.updateMedia;

  return update;
};
