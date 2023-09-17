import { SettingsFragmentFragment } from 'letterpad-sdk';
import Link from 'next/link';
import { FC } from 'react';

import { Nav } from './nav';
import { LogoWithTitle } from './site-logo';

export const Header: FC<{ settings: SettingsFragmentFragment }> = ({
  settings,
}) => {
  return (
    <header
      className="lp-header mx-auto flex max-h-20 w-full  max-w-[1480px] items-center bg-cover bg-no-repeat px-4 py-12 sm:px-8"
      // style={{ backgroundImage: `url(${settings.banner?.src})` }}
    >
      <Link href="/" aria-label={settings.site_title}>
        <LogoWithTitle logo={settings.site_logo} title={settings.site_title} />
      </Link>
      <Nav menu={settings.menu} />
    </header>
  );
};
