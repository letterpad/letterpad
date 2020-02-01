import { QUERY_MEDIA } from "./../../../shared/queries/Queries";
import { DELETE_MEDIA } from "./../../../shared/queries/Mutations";
import apolloClient from "../../../shared/apolloClient";
import {
  MediaQuery,
  DeleteMediaMutation,
  MediaFilters,
} from "../../../__generated__/gqlTypes";

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
