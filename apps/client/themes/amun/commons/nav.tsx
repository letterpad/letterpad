'use client';
import classNames from 'classnames';
import { Navigation } from 'letterpad-sdk';
import Link from 'next/link';
import { FC, useState } from 'react';

import ThemeSwitch from '@/components/ThemeSwitch';

interface Props {
  menu: Omit<Navigation, 'original_name'>[];
}
export const Nav: FC<Props> = ({ menu }) => {
  const _menu = getMenu(menu);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="ml-auto flex gap-1">
      <nav>
        <ul className="heading-color mr-1 flex gap-5 lg:flex">
          <div className="hidden items-center  md:flex">
            {_menu}
            <li>
              <ThemeSwitch />
            </li>
          </div>

          <li className="relative z-20">
            <ul
              className={classNames(
                'absolute -left-36 top-8 w-[180px] flex-col gap-0.5 rounded-lg border border-gray-100  bg-white p-4 shadow-md dark:border-gray-600 dark:bg-black md:hidden',
                { hidden: !menuOpen }
              )}
            >
              {_menu}
            </ul>
          </li>
        </ul>
      </nav>

      <nav className="relative lg:hidden">
        <button
          className={classNames('cursor-pointer p-1.5 ', {
            hidden: menuOpen,
          })}
          aria-label="Nav"
          onClick={() => setMenuOpen(true)}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 16 16"
            className="h-auto w-5"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 5H0V4h16v1zm0 8H0v-1h16v1zm0-4.008H0V8h16v.992z"></path>
          </svg>
        </button>
        <button
          className={classNames('cursor-pointer p-1.5', {
            hidden: !menuOpen,
          })}
          aria-label="Nav"
          onClick={() => setMenuOpen(false)}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 16 16"
            className="h-auto w-5"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.116 8l-4.558 4.558.884.884L8 8.884l4.558 4.558.884-.884L8.884 8l4.558-4.558-.884-.884L8 7.116 3.442 2.558l-.884.884L7.116 8z"
            ></path>
          </svg>
        </button>
      </nav>
    </div>
  );
};

function getMenu(menu: Omit<Navigation, 'original_name'>[]) {
  return menu.map((item, i) => {
    return (
      <li key={item.slug}>
        <Link
          key={item.slug}
          href={i === 0 ? '/' : item.slug}
          className="block text-md font-medium capitalize  sm:p-4"
        >
          {item.label}
        </Link>
      </li>
    );
  });
}
