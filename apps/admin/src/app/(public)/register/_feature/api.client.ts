import { useCreateAuthorMutation } from "graphql-letterpad/dist/hooks";

export const useCreateAuthor = () => {
  const [{ }, createAuthor] = useCreateAuthorMutation();

  return {
    createAuthor,
  };
};
