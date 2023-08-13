import { Media } from "@/__generated__/__types__";
import {
  DeleteMediaDocument,
  DeleteMediaMutation,
  DeleteMediaMutationVariables,
  UpdateMediaDocument,
  UpdateMediaMutation,
  UpdateMediaMutationVariables,
} from "@/__generated__/queries/mutations.graphql";

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
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
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
