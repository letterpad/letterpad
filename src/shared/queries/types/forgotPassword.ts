/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: forgotPassword
// ====================================================

export interface forgotPassword_forgotPassword {
  __typename: "ForgotPasswordResponse";
  ok: boolean;
  msg: string | null;
}

export interface forgotPassword {
  forgotPassword: forgotPassword_forgotPassword;
}

export interface forgotPasswordVariables {
  email: string;
}
