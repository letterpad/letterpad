/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SettingOptions } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL query operation: getOptions
// ====================================================

export interface getOptions_settings {
  __typename: "Setting";
  id: number | null;
  option: SettingOptions | null;
  value: string | null;
}

export interface getOptions {
  settings: (getOptions_settings | null)[] | null;
}
