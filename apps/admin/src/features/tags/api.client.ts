import {
  useDeleteTagsMutation,
  useUpdateTagsMutation,
} from "@/__generated__/src/graphql/queries/mutations.graphql";
import {
  TagsQueryVariables,
  useTagsQuery,
} from "@/__generated__/src/graphql/queries/queries.graphql";
import { isTagsNode } from "@/utils/type-guards";

export const useGetTags = (
  variables: TagsQueryVariables["filters"] = {},
  option = { skip: false }
) => {
  const [{ data, fetching, error }, refetch] = useTagsQuery({
    variables: {
      filters: variables,
    },
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
  const [{ data, fetching, error }, updateTags] = useUpdateTagsMutation();
  const { refetch } = useGetTags({}, { skip: true });
  return {
    fetching,
    error,
    updateTags: async (data: Parameters<typeof updateTags>[0]) => {
      const result = await updateTags(data);
      return result;
    },
  };
};

export const useDeleteTags = () => {
  const [{ fetching, error }, deleteTags] = useDeleteTagsMutation();
  const { refetch } = useGetTags({}, { skip: true });

  return {
    fetching,
    error,
    deleteTags: async (data: Parameters<typeof deleteTags>[0]) => {
      const result = await deleteTags(data);
      refetch({ requestPolicy: "network-only" });
      return result;
    },
  };
};
