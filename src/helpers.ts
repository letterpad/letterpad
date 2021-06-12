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
import { initializeApollo } from "./graphql/apollo";
import { Media } from "@/__generated__/type-defs.graphqls";

export const deleteImageAPI = async (img: Media) => {
  const client = await initializeApollo();

  const response = await client.mutate<
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
  const client = await initializeApollo();
  if (!img) return;

  const response = await client.mutate<
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
