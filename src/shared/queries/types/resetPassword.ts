/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: resetPassword
// ====================================================

export interface resetPassword_resetPassword {
  __typename: "ForgotPasswordResponse";
  ok: boolean;
  msg: string | null;
}

export interface resetPassword {
  resetPassword: resetPassword_resetPassword;
}

export interface resetPasswordVariables {
  token: string;
  password: string;
}
