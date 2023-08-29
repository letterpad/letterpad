import { useQuery } from "urql";

import {
  TagsDocument,
  TagsQuery,
} from "@/__generated__/src/graphql/queries/queries.graphql";
import { isTagsNode } from "@/utils/type-guards";

export const useGetTags = () => {
  const [{ data, fetching, error }] = useQuery<TagsQuery>({
    query: TagsDocument,
  });

  return {
    fetching,
    error,
    data: isTagsNode(data?.tags) ? data?.tags.rows : undefined,
  };
};
