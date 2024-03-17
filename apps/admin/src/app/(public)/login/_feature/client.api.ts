import { useForgotPasswordMutation } from "letterpad-graphql/hooks";

export const useForgotPassword = () => {
  const [, forgotPassword] = useForgotPasswordMutation();

  return {
    forgotPassword,
  };
};
