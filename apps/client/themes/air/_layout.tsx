import classNames from 'classnames';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

import Link from '@/components/Link';

import { Footer } from './commons/footer';
import { Nav } from './commons/nav';
import { LogoWithTitle } from './commons/site-logo';
import { getData } from '../../src/data';

export interface Props {
  children: ReactNode;
}

export const Layout = async ({ children }: Props) => {
  const data = await getData();
  if (!data) return notFound();
  const { settings, me } = data;

  return (
    <>
      <header className="mx-auto flex w-full max-w-[1480px] items-center bg-cover bg-no-repeat px-5  py-5 sm:px-8">
        <Link href="/" aria-label={settings.site_title}>
          <LogoWithTitle
            logo={settings.site_logo}
            title={settings.site_title}
          />
        </Link>
        <Nav menu={settings.menu} />
      </header>
      <div
        className={classNames('mx-auto max-w-[1480px] px-5 py-20 sm:px-8', {})}
      >
        <h1
          className={classNames(
            'max-w-screen-xl  text-3xl sm:text-6xl sm:leading-tight'
          )}
          dangerouslySetInnerHTML={{ __html: settings.site_description! }}
        ></h1>
      </div>
      <div className={classNames('mx-auto max-w-[1480px] px-5 sm:px-8')}>
        {children}
      </div>
      <Footer settings={settings} me={me} />
    </>
  );
};
