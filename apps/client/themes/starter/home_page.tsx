import {
  MeFragmentFragment,
  PageFragmentFragment,
  SettingsFragmentFragment,
} from 'letterpad-sdk';
import { FC, ReactNode } from 'react';

export interface Props {
  data: PageFragmentFragment;
  children: ReactNode;
  settings: SettingsFragmentFragment;
  me: MeFragmentFragment;
}
export const HomePage: FC<Props> = ({ children, data, settings, me }) => {
  return <div>The user wants to display a page as the homepage.</div>;
};
