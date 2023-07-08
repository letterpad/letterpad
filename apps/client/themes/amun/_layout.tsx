import classNames from 'classnames';
import { Navigation } from 'letterpad-sdk';
import { FC, ReactNode } from 'react';

import Link from '@/components/Link';

import { Footer } from './commons/footer';
import { Nav } from './commons/nav';
import { LogoWithTitle } from './commons/site-logo';
import { Subscribe } from './commons/subscribe';
import { getData } from '../../src/data';

export interface Props {
  children: ReactNode;
  isHomeCollection: boolean;
  props: Pick<Awaited<ReturnType<typeof getData>>, 'me' | 'settings'>;
}

export const Layout = ({ children, props, isHomeCollection }: Props) => {
  const { settings } = props;
  const menu = getMenu(settings.menu);
  // const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className="mx-auto flex max-w-[1480px] items-center bg-cover bg-no-repeat px-5 py-5  sm:px-8"
        // style={{ backgroundImage: `url(${settings.banner?.src})` }}
      >
        <Link href="/" aria-label={props.settings.site_title}>
          <LogoWithTitle
            logo={props.settings.site_logo}
            title={props.settings.site_title}
          />
        </Link>
        <Nav menu={settings.menu} />
      </header>
      <div
        style={{
          backgroundImage: isHomeCollection
            ? `url(${props.settings.banner?.src})`
            : '',
        }}
        className={classNames('bg-cover bg-bottom bg-no-repeat', {
          'py-32': isHomeCollection,
        })}
      >
        <Section className={!isHomeCollection ? 'hidden' : 'py-20'}>
          <h1
            className={
              'max-w-screen-xl  text-xl font-bold sm:text-7xl sm:leading-tight'
            }
            dangerouslySetInnerHTML={{ __html: settings.site_title! }}
          />
          <h1
            className={'max-w-screen-xl  text-xl sm:text-2xl sm:leading-tight'}
            dangerouslySetInnerHTML={{ __html: settings.site_description! }}
          />
        </Section>
      </div>
      <Section>{children}</Section>
      <Subscribe />
      <Footer {...props} />
    </>
  );
};

function getMenu(menu: Omit<Navigation, 'original_name'>[]) {
  return menu.map((item, i) => {
    return (
      <li key={item.slug}>
        <Link
          href={i === 0 ? '/' : item.slug}
          className="block text-md font-medium capitalize  sm:p-4"
        >
          {item.label}
        </Link>
      </li>
    );
  });
}

const Section: FC<{ className?: string; children: ReactNode }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={classNames('mx-auto max-w-[1480px] px-5 sm:px-8', className)}
    >
      {children}
    </div>
  );
};
