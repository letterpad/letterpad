import { InputAuthor } from "@/__generated__/__types__";
import { useUpdateAuthorMutation } from "@/__generated__/src/graphql/queries/mutations.graphql";
import { useMeQuery } from "@/__generated__/src/graphql/queries/queries.graphql";
import { isAuthor } from "@/utils/type-guards";

export const useUpdateAuthor = () => {
  const [{ data, fetching, error }, a] = useUpdateAuthorMutation();

  return {
    fetching,
    error,
    data: isAuthor(data) ? data : undefined,
    updateAuthor: async (change: InputAuthor) => {
      const result = await a({
        author: {
          ...change,
        },
      });
      return result;
    },
  };
};

export const useGetAuthor = () => {
  const [{ data, fetching, error }] = useMeQuery();

  return {
    fetching,
    error,
    data: isAuthor(data?.me) ? data?.me : undefined,
  };
};
