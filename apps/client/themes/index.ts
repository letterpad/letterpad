import * as Air from './air';
import * as GridDefaultTheme from './grid';
import * as List from './list';

export const useTheme = (theme?: string | null) => {
  if (theme === 'minimal') return { ...GridDefaultTheme, ...List };
  if (theme === 'air') return { ...GridDefaultTheme, ...Air };
  return GridDefaultTheme;
};
