import classNames from 'classnames';
import { ReactNode } from 'react';

import Link from '@/components/Link';

import { Footer } from './commons/footer';
import { Nav } from './commons/nav';
import { LogoWithTitle } from './commons/site-logo';
import { getData } from '../../src/data';

export interface Props {
  children: ReactNode;
  props: Pick<Awaited<ReturnType<typeof getData>>, 'me' | 'settings'>;
}

export const Layout = ({ children, props }: Props) => {
  const { settings, me } = props;

  return (
    <>
      <header className="mx-auto flex w-full max-w-[1480px] items-center bg-cover bg-no-repeat px-5  py-5 sm:px-8">
        <Link href="/" aria-label={props.settings.site_title}>
          <LogoWithTitle
            logo={props.settings.site_logo}
            title={props.settings.site_title}
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
