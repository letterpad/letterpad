import * as Air from './air';
import * as Amun from './amun';
import * as GridDefaultTheme from './grid';
import * as List from './list';

export const getTheme = (theme?: string | null) => {
  return { ...GridDefaultTheme };
  if (theme === 'minimal') return { ...GridDefaultTheme, ...List };
  if (theme === 'air') return { ...GridDefaultTheme, ...Air };
  if (theme === 'amun') return { ...GridDefaultTheme, ...Amun };
  return GridDefaultTheme;
};
