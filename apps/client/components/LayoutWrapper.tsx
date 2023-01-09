import {
  Author,
  Navigation,
  NavigationType,
  SettingsFragmentFragment,
} from 'letterpad-sdk';
import { ReactNode, useEffect, useRef } from 'react';

import Footer from './Footer';
import Link from './Link';
import { LogoWithTitle } from './Logo';
import MobileNav from './MobileNav';
import PageTitle from './PageTitle';
import SectionContainer from './SectionContainer';
import ThemeSwitch from './ThemeSwitch';

interface Props {
  children: ReactNode;
  props: {
    settings: SettingsFragmentFragment;
    me: Author;
    showBrand?: boolean;
  };
}

const LayoutWrapper = ({ children, props }: Props) => {
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
  if (
    props.settings.__typename !== 'Setting' ||
    props.me?.__typename !== 'Author'
  )
    return <div>Setting not found</div>;

  const { show_about_page, show_tags_page } = props.settings;

  const routes = [...props.settings.menu];
  if (show_tags_page) {
    routes.push({
      slug: '/tags',
      label: 'Tags',
      type: NavigationType.Page,
      original_name: 'Tags',
    });
  }
  if (show_about_page) {
    routes.push({
      slug: '/about',
      label: 'About',
      type: NavigationType.Page,
      original_name: 'About',
    });
  }

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
                title={props.showBrand ? '' : props.settings.site_title}
              />
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">{menu}</div>
            <ThemeSwitch />
            <MobileNav routes={routes} />
          </div>
        </header>
        {props.showBrand && (
          <div className="py:10 space-y-2 md:space-y-3 md:py-32">
            <SectionContainer>
              <div className="py-10">
                <BrandText
                  tagline={props.settings.site_tagline}
                  title={props.settings.site_title}
                  description={props.settings.site_description}
                />
              </div>
            </SectionContainer>
          </div>
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

export default LayoutWrapper;

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
      <PageTitle>{title}</PageTitle>
      <p className="pb-4 text-center text-md font-bold leading-10 md:text-lg">
        {tagline}
      </p>
      <p className="hidden px-4 text-center text-sm font-medium italic leading-6 md:block md:text-md">
        {description}
      </p>
    </>
  );
};
