import classNames from 'classnames';
import { FC } from 'react';

import Link from '@/components/Link';

import { CollapsableMenu } from './collapsable-menu';
import { FollowMe } from './followme';
import { SocialIcons } from '../social-icons';
import { SubscribeModal } from '../subscribe-modal';
import ThemeSwitch from '../theme-switch';
import { Menu } from '../../components/menu';
import { ProfileDropdown } from '../../components/profile-dropdown';
import { LogoOrTitle } from '../../components/site-logo';

interface Props {
  settings: any;
  isHome?: boolean;
  showCollapsedMenu?: boolean;
  me: any;
}
export const Navbar: FC<Props> = ({
  settings,
  isHome = false,
  showCollapsedMenu,
  me,
}) => {
  const routes = [...settings.menu];
  const logoOrTitle = (
    <LogoOrTitle logo={settings.site_logo} title={settings.site_title} />
  );
  return (
    <>
      <div className="bg-accent-50  bg-cover text-white py-4 px-4">
        <div
          className={classNames('mx-auto  max-w-7xl md:px-20 space-y-10', {
            'md:space-y-0': !isHome,
          })}
        >
          <header className=" flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <CollapsableMenu
                settings={settings}
                forceShow={showCollapsedMenu}
              />
              <Link
                href="/"
                aria-label={settings.site_title}
                className="hidden md:block"
              >
                {logoOrTitle}
              </Link>
            </div>
            <div className="lp-header-right flex items-center text-base leading-5 gap-4">
              <FollowMe username={me.username} />
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </header>
          <div>
            <Link
              href="/"
              aria-label={settings.site_title}
              className="md:hidden flex justify-center"
            >
              {logoOrTitle}
            </Link>
            {
              <p className="text-center py-2 md:hidden">
                {settings.site_tagline}
              </p>
            }
          </div>

          <div
            className={classNames(
              'flex md:justify-between justify-center items-center',
              { 'md:hidden': !isHome }
            )}
          >
            <SubscribeModal settings={settings} />
            <SocialIcons me={me} />
          </div>

          {isHome && <Menu routes={routes} />}
        </div>
      </div>
      {isHome && (
        <div className="bg-slate-900  bg-cover text-slate-300 py-10">
          <div className="px-4 flex text-center justify-center mx-auto">
            <span className="max-w-4xl md:text-lg">
              {settings.site_description}
            </span>
          </div>
        </div>
      )}
    </>
  );
};
