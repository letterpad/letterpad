import * as Grid from './grid';
import * as List from './list';

interface Props {
  theme: 'grid' | 'list';
}

export const useTheme = ({ theme = 'list' }: Props) => {
  if (theme === 'list') return { ...Grid, ...List };
  return Grid;
};
