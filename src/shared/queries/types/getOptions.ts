/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getOptions
// ====================================================

export interface getOptions_settings {
  __typename: "Setting";
  id: number | null;
  option: string | null;
  value: string | null;
}

export interface getOptions {
  settings: (getOptions_settings | null)[] | null;
}
