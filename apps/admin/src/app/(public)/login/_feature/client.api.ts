import { useForgotPasswordMutation } from "@/__generated__/src/graphql/queries/mutations.graphql";

export const useForgotPassword = () => {
  const [, forgotPassword] = useForgotPasswordMutation();

  return {
    forgotPassword,
  };
};
