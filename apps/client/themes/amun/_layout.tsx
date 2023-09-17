import { Navigation } from 'letterpad-sdk';
import { notFound } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

import Link from '@/components/Link';

import { Banner } from './commons/banner';
import { Css } from './commons/css';
import { Footer } from './commons/footer';
import { Header } from './commons/header';
import { Section } from './commons/section';
import { Subscribe } from './commons/subscribe';
import { getData } from '../../src/data';

export const forceDynamic = true;

export const Layout: FC<PropsWithChildren> = async ({ children }) => {
  const data = await getData();
  if (!data) return notFound();
  const { settings } = data;
  return (
    <>
      <Header settings={settings} />
      <Banner settings={settings} />
      <Section>{children}</Section>
      <Subscribe />
      <Footer />
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
