import { useCreateAuthorMutation } from "@/__generated__/src/graphql/queries/mutations.graphql";

export const useCreateAuthor = () => {
  const [{}, createAuthor] = useCreateAuthorMutation();

  return {
    createAuthor,
  };
};
