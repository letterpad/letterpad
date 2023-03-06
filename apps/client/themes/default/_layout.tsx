import { Author, Navigation, SettingsFragmentFragment } from 'letterpad-sdk';
import { ReactNode, useEffect, useRef } from 'react';
import { MobileNav } from 'themes/default/commons/mobile-nav';

import Link from '@/components/Link';
import ThemeSwitch from '@/components/ThemeSwitch';

import { Footer } from './commons/footer';
import { SectionContainer } from './commons/section';
import { LogoWithTitle } from './commons/site-logo';
import { PageTitle } from './commons/title';

export interface Props {
  children: ReactNode;
  pageName: string;
  isHomeCollection: boolean;
  props: {
    settings: SettingsFragmentFragment;
    me: Author;
  };
}

export const Layout = ({
  children,
  props,
  pageName,
  isHomeCollection,
}: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const winHeight = window.innerHeight;
    const bodyHeight = document.body.clientHeight;
    const contentHeight = contentRef.current.clientHeight;
    if (winHeight > bodyHeight) {
      const extraHeight = winHeight - bodyHeight;
      contentRef.current.style.minHeight = extraHeight + contentHeight + 'px';
    }
  }, []);

  const routes = [...props.settings.menu];
  const isCollection = isHomeCollection && pageName === 'Home';

  const menu = getMenu(routes);
  return (
    <>
      <div
        className={'bg-accent-50  bg-cover text-white'}
        style={{ backgroundImage: `url(${props.settings.banner?.src})` }}
      >
        <header className="mx-auto flex max-w-7xl items-center justify-between py-4 px-4 md:px-20">
          <div>
            <Link href="/" aria-label={props.settings.site_title}>
              <LogoWithTitle
                logo={props.settings.site_logo}
                title={isCollection ? '' : props.settings.site_title}
              />
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden md:block">{menu}</div>
            <ThemeSwitch />
            {/* <Subscribe /> */}
            <MobileNav routes={routes} />
          </div>
        </header>
        {isCollection && (
          <SectionContainer className="py:10 space-y-2 md:space-y-3 md:py-32">
            <div className="py-10">
              <BrandText
                tagline={props.settings.site_tagline}
                title={props.settings.site_title}
                description={props.settings.site_description}
              />
            </div>
          </SectionContainer>
        )}
      </div>
      <main className="mb-auto" ref={contentRef}>
        {children}
      </main>
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

const BrandText = ({ title, tagline, description }) => {
  return (
    <>
      <PageTitle className="text-center">{title}</PageTitle>
      <p className="pb-4 text-center text-md font-bold leading-6 md:text-md">
        {tagline}
      </p>
      <p className="hidden px-4 text-center text-sm font-medium italic leading-6 md:block md:text-md">
        {description}
      </p>
    </>
  );
};
