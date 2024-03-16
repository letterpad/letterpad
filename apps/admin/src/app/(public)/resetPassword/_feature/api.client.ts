import { useResetPasswordMutation } from "letterpad-graphql/dist/hooks";

export const useResetPassword = () => {
  const [{ }, resetPassword] = useResetPasswordMutation();

  return {
    resetPassword,
  };
};
