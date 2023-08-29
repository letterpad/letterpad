import { Message } from "ui";
import { useMutation, useQuery } from "urql";

import { InputAuthor } from "@/__generated__/__types__";
import {
  UpdateAuthorDocument,
  UpdateAuthorMutation,
} from "@/__generated__/src/graphql/queries/mutations.graphql";
import {
  MeDocument,
  MeQuery,
} from "@/__generated__/src/graphql/queries/queries.graphql";

import { isAuthor } from "../../utils/type-guards";

export const useUpdateAuthor = () => {
  const [{ data, fetching, error }, a] =
    useMutation<UpdateAuthorMutation["updateAuthor"]>(UpdateAuthorDocument);

  return {
    fetching,
    error,
    data: isAuthor(data) ? data : undefined,
    updateAuthor: async (change: InputAuthor) => {
      Message().loading({ content: "Updating, Please wait..." });
      const result = await a({
        author: {
          ...change,
        },
      });
      Message().success({ content: "Saved", duration: 100 });
      return result;
    },
  };
};

export const useGetAuthor = () => {
  const [{ data, fetching, error }] = useQuery<MeQuery>({
    query: MeDocument,
  });

  return {
    fetching,
    error,
    data: isAuthor(data?.me) ? data?.me : undefined,
  };
};
