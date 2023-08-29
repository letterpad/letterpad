import { useMutation, useQuery } from "urql";

import {
  TagsDocument,
  TagsQuery,
} from "@/__generated__/src/graphql/queries/queries.graphql";
import { isTagsNode } from "@/utils/type-guards";

import {
  DeleteTagsDocument,
  DeleteTagsMutation,
  UpdateTagsDocument,
  UpdateTagsMutation,
  useDeleteTagsMutation,
} from "../../../__generated__/src/graphql/queries/mutations.graphql";

export const useGetTags = (option = { skip: false }) => {
  const [{ data, fetching, error }, refetch] = useQuery<TagsQuery>({
    query: TagsDocument,
    pause: option.skip,
  });

  return {
    fetching,
    error,
    data: isTagsNode(data?.tags) ? data?.tags.rows : undefined,
    refetch,
  };
};

export const useUpdateTags = () => {
  const [{ data, fetching, error }, updateTags] =
    useMutation<UpdateTagsMutation>(UpdateTagsDocument);
  const { refetch } = useGetTags({ skip: true });
  return {
    fetching,
    error,
    updateTags: async (data: Parameters<typeof updateTags>) => {
      const result = await updateTags(data);
      refetch({ requestPolicy: "network-only" });
      return result;
    },
  };
};

export const useDeleteTags = () => {
  const [{ fetching, error }, deleteTags] =
    useMutation<DeleteTagsMutation>(DeleteTagsDocument);
  const { refetch } = useGetTags({ skip: true });

  return {
    fetching,
    error,
    deleteTags: async (data: Parameters<typeof deleteTags>["0"]) => {
      const result = await deleteTags(data);
      refetch({ requestPolicy: "network-only" });
      return result;
    },
  };
};
