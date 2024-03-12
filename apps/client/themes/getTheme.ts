import { ComponentType } from 'react';
import { HomePostsProps } from 'types/pageTypes';

import * as Air from './air';
import * as Amun from './amun';
import * as GridDefaultTheme from './grid';
import * as List from './list';

export interface Theme {
  HomePosts: ComponentType<HomePostsProps>;
  HomePage?: ComponentType<any>;
  PreHeader?: ComponentType;
}

export const getTheme: (theme?: string | null) => Theme = (theme) => {
  if (theme === 'minimal') return { ...GridDefaultTheme, ...List };
  if (theme === 'air') return { ...GridDefaultTheme, ...Air };
  if (theme === 'amun') return { ...GridDefaultTheme, ...Amun };
  return GridDefaultTheme;
};
