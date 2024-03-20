import { useCreateAuthorMutation } from "letterpad-graphql/hooks";

export const useCreateAuthor = () => {
  const [{ }, createAuthor] = useCreateAuthorMutation();

  return {
    createAuthor,
  };
};
