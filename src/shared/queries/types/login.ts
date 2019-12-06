/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: login
// ====================================================

export interface login_login_errors {
  __typename: "Error";
  message: string | null;
  path: string;
}

export interface login_login {
  __typename: "LoginResponse";
  ok: boolean;
  token: string | null;
  errors: login_login_errors[] | null;
}

export interface login {
  login: login_login;
}

export interface loginVariables {
  username: string;
  password: string;
}
