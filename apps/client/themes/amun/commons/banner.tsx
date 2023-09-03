'use client';

import classNames from 'classnames';
import { NavigationType, SettingsFragmentFragment } from 'letterpad-sdk';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

import { Section } from './section';

export const Banner: FC<{
  settings: SettingsFragmentFragment;
}> = ({ settings }) => {
  const pathname = usePathname();
  const [firstItemOfMenu] = settings?.menu ?? [];
  const isCollection =
    firstItemOfMenu?.type === NavigationType.Tag && pathname === '/';

  if (!isCollection) return null;
  return (
    <div
      style={{
        backgroundImage: `url(${settings.banner?.src})`,
      }}
      className={classNames('mb-10 bg-cover bg-bottom bg-no-repeat py-28')}
    >
      <Section className={'py-20'}>
        <h1
          className={
            'max-w-screen-xl text-4xl font-bold sm:text-7xl sm:leading-tight'
          }
          dangerouslySetInnerHTML={{ __html: settings.site_title! }}
        />
        <h1
          className={'max-w-screen-xl  text-xl sm:text-2xl sm:leading-tight'}
          dangerouslySetInnerHTML={{ __html: settings.site_description! }}
        />
      </Section>
    </div>
  );
};
