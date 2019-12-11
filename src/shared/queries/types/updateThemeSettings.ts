/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { InputThemeSettingOptions } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: updateThemeSettings
// ====================================================

export interface updateThemeSettings {
  updateThemeSettings: boolean | null;
}

export interface updateThemeSettingsVariables {
  name: string;
  settings: (InputThemeSettingOptions | null)[];
}
