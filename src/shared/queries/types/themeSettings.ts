/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: themeSettings
// ====================================================

export interface themeSettings_themeSettings {
  __typename: "ThemeSettings";
  name: string | null;
  value: string | null;
  settings: string | null;
}

export interface themeSettings {
  themeSettings: (themeSettings_themeSettings | null)[] | null;
}

export interface themeSettingsVariables {
  name?: string | null;
}
