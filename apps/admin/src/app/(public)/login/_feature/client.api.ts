import { useForgotPasswordMutation } from "graphql-letterpad/dist/hooks";

export const useForgotPassword = () => {
  const [, forgotPassword] = useForgotPasswordMutation();

  return {
    forgotPassword,
  };
};
