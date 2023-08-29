import { useMutation, useQuery } from "urql";

import { ResetPasswordDocument } from "../../graphql/queries/mutations.graphql";
import { ResetPasswordMutationResult } from "../../../__generated__/src/graphql/queries/mutations.graphql";

export const useResetPassword = () => {
  const [{}, resetPassword] = useMutation<ResetPasswordMutationResult["data"]>(
    ResetPasswordDocument
  );

  return {
    resetPassword,
  };
};
