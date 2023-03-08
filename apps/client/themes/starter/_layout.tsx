import { Author, SettingsFragmentFragment } from 'letterpad-sdk';
import { ReactNode } from 'react';

export interface Props {
  children: ReactNode;
  pageName: string;
  isHomeCollection: boolean;
  props: {
    settings: SettingsFragmentFragment;
    me: Author;
  };
}

export const Layout = ({
  children,
  props,
  pageName,
  isHomeCollection,
}: Props) => {
  const { settings, me } = props;
  return <div>{children}</div>;
};
