import { ComponentType } from 'react';
import { HomePostsProps } from 'types/pageTypes';

import * as Air from './air';
import * as Amun from './amun';
import * as GridDefaultTheme from './grid';
import * as List from './list';
import * as Wavique from './wavique';

export interface Theme {
  HomePosts?: ComponentType<HomePostsProps>;
  HomePage?: ComponentType<any>;
  PreHeader?: ComponentType;
}

export const getTheme: (theme?: string | null) => Theme = (theme) => {
  let selectedTheme: Theme;

  switch (theme) {
    case 'minimal':
      selectedTheme = List;
      break;
    case 'air':
      selectedTheme = Air;
      break;
    case 'amun':
      selectedTheme = Amun;
      break;
    case 'wavique':
      selectedTheme = Wavique;
      break;
    default:
      selectedTheme = GridDefaultTheme;
      break;
  }

  return {
    ...GridDefaultTheme,
    ...selectedTheme,
  };
};
