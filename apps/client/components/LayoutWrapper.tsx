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
import ThemeSwitch from './ThemeSwitch';

interface Props {
  children: ReactNode;
  props: {
    settings: SettingsFragmentFragment;
    me: Author;
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
      <div className="border-b-[1px] dark:border-gray-700">
        <header className="mx-auto flex max-w-7xl items-center justify-between py-4 px-8 md:px-20">
          <div>
            <Link href="/" aria-label={props.settings.site_title}>
              <LogoWithTitle
                logo={props.settings.site_logo}
                title={props.settings.site_title}
              />
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">{menu}</div>
            <ThemeSwitch />
            <MobileNav routes={routes} />
          </div>
        </header>
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
        className="p-1 font-medium capitalize text-gray-900 dark:text-gray-100 sm:p-4"
      >
        {item.label}
      </a>
    ) : (
      <Link
        key={item.slug}
        href={i === 0 ? '/' : item.slug}
        target="_self"
        className="link -1 font-medium capitalize sm:p-4"
      >
        {item.label}
      </Link>
    );
  });
}
