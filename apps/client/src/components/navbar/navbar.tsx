import classNames from 'classnames';
import { ComponentType, FC } from 'react';

import Link from '@/components/Link';

import { CollapsableMenu } from './collapsable-menu';
import { FollowMe } from './followme';
import { ThemeSwitcher } from './theme-switcher';
import { SocialIcons } from '../social-icons';
import { SubscribeModal } from '../subscribe-modal';
import { Menu } from '../../components/menu';
import { ProfileDropdown } from '../../components/profile-dropdown';
import { LogoOrTitle } from '../../components/site-logo';

interface Props {
  settings: any;
  isHome?: boolean;
  showCollapsedMenu?: boolean;
  me: any;
  PreHeader?: ComponentType;
}
export const Navbar: FC<Props> = ({
  settings,
  isHome = false,
  showCollapsedMenu,
  me,
  PreHeader,
}) => {
  const routes = [...settings.menu];
  const logoOrTitle = (
    <LogoOrTitle logo={settings.site_logo} title={settings.site_title} />
  );
  return (
    <>
      <div className="relative bg-accent-50 bg-cover text-white py-4 px-4">
        {PreHeader && <PreHeader />}
        <div
          className={classNames(
            // Because PreHeader can be absolute,
            // we set this to relative to make sure the menu is not
            // hidden behind the PreHeader
            'relative mx-auto z-1 max-w-7xl md:px-20 space-y-10',
            {
              'md:space-y-0': !isHome,
            }
          )}
        >
          <header className="flex items-center justify-between">
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
              <ThemeSwitcher />
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
            <span
              className="max-w-4xl md:text-lg font-sans"
              dangerouslySetInnerHTML={{
                __html:
                  settings.site_description || settings.site_tagline || me.name,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
