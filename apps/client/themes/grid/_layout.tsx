import { Author, Navigation, SettingsFragmentFragment } from 'letterpad-sdk';
import { ReactNode, useEffect, useRef } from 'react';

import Link from '@/components/Link';
import ThemeSwitch from '@/components/ThemeSwitch';

import { Footer } from './commons/footer';
import { MobileNav } from './commons/mobile-nav';
import { LogoWithTitle } from './commons/site-logo';
import { PageTitle } from './commons/title';

export interface Props {
  children: ReactNode;
  isHomeCollection: boolean;
  props: {
    settings: SettingsFragmentFragment;
    me: Author;
  };
}

export const Layout = ({ children, props, isHomeCollection }: Props) => {
  const routes = [...props.settings.menu];

  const menu = getMenu(routes);
  return (
    <>
      <div
        className={'bg-accent-50  bg-cover text-white'}
        // style={{ backgroundImage: `url(${props.settings.banner?.src})` }}
      >
        <header className="mx-auto flex max-w-7xl items-center justify-between py-4 px-4 md:px-20">
          <div>
            <Link href="/" aria-label={props.settings.site_title}>
              <LogoWithTitle
                logo={props.settings.site_logo}
                title={isHomeCollection ? '' : props.settings.site_title}
              />
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden md:block">{menu}</div>
            <ThemeSwitch />
            <MobileNav routes={routes} />
          </div>
        </header>
      </div>
      <main className="mb-auto">{children}</main>
      <br />
      <br />
      <br />
      <div className="border-b-[1px] dark:border-gray-700">
        <Footer author={props.me} settings={props.settings} />
      </div>
    </>
  );
};

function getMenu(menu: Omit<Navigation, 'original_name'>[]) {
  return menu.map((item, i) => {
    return item.type === 'custom' ? (
      <a
        key={item.slug}
        href={item.slug}
        className="p-1 text-md font-medium capitalize text-gray-50 sm:p-4"
      >
        {item.label}
      </a>
    ) : (
      <Link
        key={item.slug}
        href={i === 0 ? '/' : item.slug}
        target="_self"
        className="text-md font-medium capitalize text-gray-50 sm:p-4"
      >
        {item.label}
      </Link>
    );
  });
}
