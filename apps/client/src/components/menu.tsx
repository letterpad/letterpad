'use client';

import classNames from 'classnames';
import { Navigation, NavigationType } from 'letterpad-sdk';
import { usePathname, useRouter } from 'next/navigation';

import Link from '@/components/Link';

export const Menu = ({ routes }) => {
  const pathname = usePathname();
  const router = useRouter();
  const menu = getMenu(
    routes,
    pathname,
    (e, item: Omit<Navigation, 'original_name'>) => {
      e.preventDefault();
      if (e.target.target === '_blank') {
        return window.open(item.slug, '_blank');
      }
      router.push(item.slug);
    }
  );

  return (
    <div className="lp-menu flex uppercase font-bold text-xs md:text-sm gap-4 md:justify-start justify-center pt-4">
      {menu}
    </div>
  );
};

function getMenu(
  menu: Omit<Navigation, 'original_name'>[],
  pathname: string,
  onClick
) {
  return menu.map((item, i) => {
    return (
      <Link
        key={item.slug}
        href={item.slug}
        target={item.type === NavigationType.Custom ? '_blank' : '_self'}
        className={classNames('text-gray-50 pb-2', {
          'border-b': pathname === item.slug,
        })}
        onClick={(e) => onClick?.(e, item)}
      >
        {item.label}
      </Link>
    );
  });
}
