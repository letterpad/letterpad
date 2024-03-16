import { useCreateAuthorMutation } from "letterpad-graphql/dist/hooks";

export const useCreateAuthor = () => {
  const [{ }, createAuthor] = useCreateAuthorMutation();

  return {
    createAuthor,
  };
};
