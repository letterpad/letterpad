/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: themeSettings
// ====================================================

export interface themeSettings_themeSettings {
  __typename: "ThemeSettings";
  name: string;
  value: string;
  settings: string;
}

export interface themeSettings {
  themeSettings: (themeSettings_themeSettings | null)[];
}

export interface themeSettingsVariables {
  name?: string;
}
