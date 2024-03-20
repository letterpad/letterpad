import classNames from 'classnames';
import { SettingsFragmentFragment } from 'letterpad-sdk';
import { ComponentType, FC } from 'react';

import Link from '@/components/Link';

import { FollowMe } from './followme';
import { ThemeSwitcher } from './theme-switcher';
import { LetterpadLogo } from '../letterpad-logo';
import { SocialIcons } from '../social-icons';
import { SubscribeModal } from '../subscribe-modal';
import { Menu } from '../../components/menu';
import { ProfileDropdown } from '../../components/profile-dropdown';
import { LogoOrTitle } from '../../components/site-logo';

interface Props {
  settings: SettingsFragmentFragment;
  isHome?: boolean;
  me: any;
  PreHeader?: ComponentType;
}
export const Navbar: FC<Props> = ({
  settings,
  isHome = false,
  me,
  PreHeader,
}) => {
  const routes = [...settings.menu];
  const logoOrTitle = (
    <LogoOrTitle
      logo={settings.site_logo}
      title={settings.site_title}
      tagline={settings.site_tagline!}
    />
  );

  return (
    <>
      <div className="relative bg-accent-50 bg-cover text-white py-4 px-4 space-y-10">
        <div className="relative mx-auto z-1 max-w-7xl md:px-20 flex justify-between bg-accent-50 items-center">
          <LetterpadLogo className="mix-blend-difference" />
          <div className="lp-header-right flex items-center text-base leading-5 gap-4">
            <FollowMe username={me.username} />
            <ThemeSwitcher />
            <ProfileDropdown />
          </div>
        </div>
        {PreHeader && <PreHeader />}
        <div
          className={classNames(
            // Because PreHeader can be absolute,
            // we set this to relative to make sure the menu is not
            // hidden behind the PreHeader
            'relative mx-auto z-1 max-w-7xl md:px-20 space-y-10',
            {
              hidden: !isHome,
            }
          )}
        >
          <header
            className={classNames(
              'flex items-center justify-between flex-col md:flex-row md:gap-0 gap-8',
              {
                hidden: !isHome,
              }
            )}
          >
            <div className="flex gap-1 items-center mix-blend-difference">
              <Link href="/" aria-label={settings.site_title}>
                {logoOrTitle}
              </Link>
            </div>
            <div
              className={classNames(
                'lp-header-right items-center text-base leading-5 gap-4 flex'
              )}
            >
              <SubscribeModal settings={settings} />
              <SocialIcons me={me} />
            </div>
          </header>
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
