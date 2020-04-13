import {
  DELETE_MEDIA,
  UPDATE_MEDIA,
} from "./../../../shared/queries/Mutations";
import {
  DeleteMediaMutation,
  Media,
  MediaFilters,
  MediaQuery,
} from "../../../__generated__/gqlTypes";

import { QUERY_MEDIA } from "./../../../shared/queries/Queries";
import { UpdateMediaMutation } from "./../../../__generated__/gqlTypes";
import apolloClient from "../../../shared/apolloClient";

export const getMedia = async (filters?: MediaFilters) => {
  return await apolloClient(true).query<MediaQuery>({
    query: QUERY_MEDIA,
    variables: {
      filters,
    },
  });
};

export const deleteMedias = async (ids: number[]) => {
  await apolloClient(true).mutate<DeleteMediaMutation>({
    mutation: DELETE_MEDIA,
    variables: {
      ids,
    },
  });
};

export const updateMedia = async (media: Media) => {
  await apolloClient(true).mutate<UpdateMediaMutation>({
    mutation: UPDATE_MEDIA,
    variables: media,
  });
};
