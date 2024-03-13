import { useResetPasswordMutation } from "graphql-letterpad/dist/hooks";

export const useResetPassword = () => {
  const [{ }, resetPassword] = useResetPasswordMutation();

  return {
    resetPassword,
  };
};
