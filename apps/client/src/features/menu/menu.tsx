'use client';

import classNames from 'classnames';
import { Navigation } from 'letterpad-sdk';
import Link from '@/components/Link';
import { useRouter, usePathname } from 'next/navigation';

export const Menu = ({ routes }) => {
  const pathname = usePathname();
  const router = useRouter();
  const menu = getMenu(routes, pathname, (e, slug) => {
    e.preventDefault();
    router.push(slug);
  });
  return (
    <div className="lp-menu hidden md:block uppercase font-bold text-sm py-10">
      {menu}
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
        <a key={item.slug} href={item.slug} className="p-1 text-gray-50 sm:p-4">
          {item.label}
        </a>
      ) : (
        <Link
          key={item.slug}
          href={item.slug}
          data-pathname={pathname ?? 'hello'}
          data-slug={item.slug}
          target="_self"
          className={classNames('text-gray-50 sm:m-4 pb-2', {
            'border-b': pathname === item.slug,
          })}
          onClick={(e) => onClick?.(e, item.slug)}
        >
          {item.label}
        </Link>
      );
    });
}
