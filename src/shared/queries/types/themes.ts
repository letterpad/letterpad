/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ThemeSettingsUIInputTypes, ThemeSettingsUITags } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL query operation: themes
// ====================================================

export interface themes_themes_settings {
  __typename: "ThemeSettings";
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

export interface themes_themes {
  __typename: "Theme";
  name: string;
  settings: themes_themes_settings[];
}

export interface themes {
  themes: themes_themes[];
}

export interface themesVariables {
  name?: string | null;
}
