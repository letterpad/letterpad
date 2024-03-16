import { useForgotPasswordMutation } from "letterpad-graphql/dist/hooks";

export const useForgotPassword = () => {
  const [, forgotPassword] = useForgotPasswordMutation();

  return {
    forgotPassword,
  };
};
