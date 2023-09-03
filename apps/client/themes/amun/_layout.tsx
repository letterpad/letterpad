import { Navigation } from 'letterpad-sdk';

import Link from '@/components/Link';

import { Banner } from './commons/banner';
import { Css } from './commons/css';
import { Footer } from './commons/footer';
import { Header } from './commons/header';
import { Section } from './commons/section';
import { Subscribe } from './commons/subscribe';
import { LayoutProps } from '../../types/pageTypes';

export const forceDynamic = true;

export const Layout = ({ children, props }: LayoutProps) => {
  const { settings } = props;
  return (
    <>
      <Header settings={props.settings} />
      <Banner settings={settings} />
      <Section>{children}</Section>
      <Subscribe />
      <Footer {...props} />
      <Css />
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
