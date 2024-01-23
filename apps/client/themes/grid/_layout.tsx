import { Navigation } from 'letterpad-sdk';
import { FC, PropsWithChildren } from 'react';

import Link from '@/components/Link';
import ThemeSwitch from '@/components/ThemeSwitch';

import { Footer } from './commons/footer';
import { MobileNav } from './commons/mobile-nav';
import { LogoWithTitle } from './commons/site-logo';
import { getAuthorAndSettingsData } from '../../src/data';
import Custom404 from '../../src/app/not-found';
import { ProfileDropdown } from '../../src/features/profile-dd';
import classNames from 'classnames';
import { headers } from 'next/headers';
import { Menu } from '../../src/features/menu/menu';

export const Layout: FC<PropsWithChildren> = async ({ children }) => {
  const data = await getAuthorAndSettingsData();
  const heads = headers();
  if (!data) return <Custom404 homepage="https://letterpad.app" />;
  const { settings, me } = data;
  const routes = [...settings.menu];
  const pathname = heads.get('path')!;
  const menu = getMenu(routes, pathname);
  return (
    <>
      <div className={'bg-accent-50  bg-cover text-white'}>
        <div className="mx-auto  max-w-7xl md:px-20">
          <header className=" flex items-center justify-between px-4 py-4 ">
            <div>
              <Link href="/" aria-label={settings.site_title}>
                <LogoWithTitle
                  logo={settings.site_logo}
                  title={settings.site_title}
                />
              </Link>
            </div>
            <div className="lp-header-right flex items-center text-base leading-5 gap-4">
              <ThemeSwitch />
              <MobileNav routes={routes} />
              <ProfileDropdown />
            </div>
          </header>
          <Menu routes={routes} />
        </div>
      </div>
      <main className="mb-auto">{children}</main>
      <div className="border-b-[1px] dark:border-gray-700">
        <Footer author={me} settings={settings} />
      </div>
    </>
  );
};

function getMenu(menu: Omit<Navigation, 'original_name'>[], pathname: string) {
  return menu
    .filter((_, i) => i !== 0)
    .map((item, i) => {
      return item.type === 'custom' ? (
        <a key={item.slug} href={item.slug} className="p-1 text-gray-50 sm:p-4">
          {item.label}
        </a>
      ) : (
        <Link
          key={item.slug}
          href={item.slug}
          data-pathname={pathname ?? 'hello'}
          data-slug={item.slug}
          target="_self"
          className={classNames('text-gray-50 sm:m-4 pb-2', {
            'border-b': pathname === item.slug,
          })}
        >
          {item.label}
        </Link>
      );
    });
}
