import { FC } from 'react';

import { HomePageProps } from '../../types/pageTypes';

export const HomePage: FC<HomePageProps> = ({
  children,
  data,
  settings,
  me,
}) => {
  return <div>The user wants to display a page as the homepage.</div>;
};
