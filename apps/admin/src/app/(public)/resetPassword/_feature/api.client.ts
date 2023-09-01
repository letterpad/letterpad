import { useResetPasswordMutation } from "@/__generated__/src/graphql/queries/mutations.graphql";

export const useResetPassword = () => {
  const [{}, resetPassword] = useResetPasswordMutation();

  return {
    resetPassword,
  };
};
