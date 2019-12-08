/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OptionInputType, SettingOptions } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: updateOptions
// ====================================================

export interface updateOptions_updateOptions {
  __typename: "Setting";
  id: number | null;
  option: SettingOptions | null;
  value: string | null;
}

export interface updateOptions {
  updateOptions: (updateOptions_updateOptions | null)[] | null;
}

export interface updateOptionsVariables {
  options?: (OptionInputType | null)[] | null;
}
