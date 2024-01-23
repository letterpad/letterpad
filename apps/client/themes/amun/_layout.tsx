import { FC, PropsWithChildren } from 'react';

import { Banner } from './commons/banner';
import { Css } from './commons/css';
import { Footer } from './commons/footer';
import { Header } from './commons/header';
import { Section } from './commons/section';
import { Subscribe } from './commons/subscribe';
import { getData } from '../../src/data';
import Custom404 from '../../src/app/not-found';

export const forceDynamic = true;

export const Layout: FC<PropsWithChildren> = async ({ children }) => {
  const data = await getData();
  if (!data) return <Custom404 homepage="https://letterpad.app" />;
  const { settings } = data;
  return (
    <>
      <Header settings={settings} />
      {/* <Banner settings={settings} /> */}
      <Section>{children}</Section>
      <Subscribe />
      <Footer />
      <Css />
    </>
  );
};
