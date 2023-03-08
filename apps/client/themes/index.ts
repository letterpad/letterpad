import * as DefaultGrid from './default';
import * as List from './list';

interface Props {
  theme: 'grid' | 'list';
}

export const useTheme = ({ theme = 'list' }: Props) => {
  if (theme === 'list') return { ...DefaultGrid, ...List };
  return DefaultGrid;
};
