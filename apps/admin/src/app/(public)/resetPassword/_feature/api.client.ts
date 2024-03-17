import { useResetPasswordMutation } from "letterpad-graphql/hooks";

export const useResetPassword = () => {
  const [{ }, resetPassword] = useResetPasswordMutation();

  return {
    resetPassword,
  };
};
