/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ThemeSettingsUIInputTypes, ThemeSettingsUITags } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL query operation: themeSettings
// ====================================================

export interface themeSettings_themeSettings_settings {
  __typename: "ThemeSettingOptions";
  name: string;
  type: ThemeSettingsUIInputTypes;
  tag: ThemeSettingsUITags;
  defaultValue: string | null;
  changedValue: string | null;
  helpText: string | null;
  label: string;
  placeholder: string | null;
  options: (string | null)[] | null;
}

export interface themeSettings_themeSettings {
  __typename: "ThemeSettings";
  name: string;
  settings: themeSettings_themeSettings_settings[];
}

export interface themeSettings {
  themeSettings: themeSettings_themeSettings[];
}

export interface themeSettingsVariables {
  name?: string | null;
}
