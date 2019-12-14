import { MediaFiltersWithPagination } from "./../../../../types/globalTypes";
import { GET_MEDIA } from "./../../../shared/queries/Queries";
import { DELETE_MEDIA } from "./../../../shared/queries/Mutations";
import {
  deleteMedia,
  deleteMediaVariables,
} from "./../../../shared/queries/types/deleteMedia";
import apolloClient from "../../../shared/apolloClient";
import { media, mediaVariables } from "../../../shared/queries/types/media";

export const getMedia = async (filters?: MediaFiltersWithPagination) => {
  return await apolloClient(true).query<media, mediaVariables>({
    query: GET_MEDIA,
    variables: {
      filters,
    },
  });
};

export const deleteMedias = async (ids: number[]) => {
  await apolloClient(true).mutate<deleteMedia, deleteMediaVariables>({
    mutation: DELETE_MEDIA,
    variables: {
      ids,
    },
  });
};
