'use client';
import { Navigation } from 'letterpad-sdk';
import React, { FC, useState } from 'react';
import { Drawer } from 'ui';
import Link from '../../../components/Link';
import { IoMenu, IoClose } from 'react-icons/io5';
import { AiOutlineMenu } from 'react-icons/ai';
import { LogoOrTitle } from '../site-logo';
import classNames from 'classnames';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
  settings: any;
  forceShow?: boolean;
}
export const CollapsableMenu: FC<Props> = ({ settings, forceShow = false }) => {
  const routes = [...settings.menu];
  const [navShow, setNavShow] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const menu = getMenu(routes, pathname, (e, slug) => {
    e.preventDefault();
    router.push(slug);
  });

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto';
      } else {
        document.body.style.overflow = 'hidden';
      }
      return !status;
    });
  };

  return (
    <div
      className={classNames('flex items-center', {
        'md:hidden': !forceShow,
      })}
    >
      <button
        type="button"
        aria-label="Toggle Menu"
        onClick={onToggleNav}
        className="h-10 w-10"
      >
        {navShow ? (
          <IoClose className="h-6 w-6 md:h-8 md:w-8" />
        ) : (
          <AiOutlineMenu className="h-5 w-5" />
        )}
      </button>
      <Drawer
        show={navShow}
        onClose={onToggleNav}
        className="fixed top-0 right-0 h-full w-80 p-6"
        dir="left"
        title=""
        closeIcon={false}
      >
        <div className="flex items-center justify-between">
          <Link href="/" aria-label={settings.site_title}>
            <LogoOrTitle
              logo={settings.site_logo}
              title={settings.site_title}
            />
          </Link>
          <button type="button" aria-label="toggle modal" onClick={onToggleNav}>
            <IoClose size={26} />
          </button>
        </div>
        <nav
          className="mt-8 h-full w-full space-y-4 capitalize text-md flex flex-col"
          onClick={onToggleNav}
        >
          {menu}
        </nav>
      </Drawer>
    </div>
  );
};

function getMenu(
  menu: Omit<Navigation, 'original_name'>[],
  pathname: string,
  onClick
) {
  return menu
    .filter((_, i) => i !== 0)
    .map((item, i) => {
      return item.type === 'custom' ? (
        <a key={item.slug} href={item.slug} className="md:font-bold sm:p-4">
          {item.label}
        </a>
      ) : (
        <Link
          key={item.slug}
          href={item.slug}
          target="_self"
          className={classNames('md:font-bold pb-2', {
            'border-b': pathname === item.slug,
          })}
          onClick={(e) => onClick?.(e, item.slug)}
        >
          {item.label}
        </Link>
      );
    });
}
