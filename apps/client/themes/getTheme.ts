import { ComponentType } from 'react';
import { HomePostsProps } from 'types/pageTypes';

import * as Air from './air';
import * as Amun from './amun';
import * as GridDefaultTheme from './grid';
import * as List from './list';
import * as Wavique from './wavique';
import * as Zenith from './zenith';
import * as Sunset from './90s-sunset'; // Added 90s sunset theme import

export interface Theme {
  HomePosts: ComponentType<HomePostsProps>;
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
    case 'zenith':
      selectedTheme = Zenith;
      break;
    case '90s-sunset': // Added case for 90s sunset theme
      selectedTheme = Sunset;
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
