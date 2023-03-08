import { Author, SettingsFragmentFragment } from 'letterpad-sdk';
import { FC } from 'react';

import Link from '@/components/Link';
import SocialIcon from '@/components/social-icons';

import { LogoWithTitle } from './site-logo';

interface Props {
  settings: SettingsFragmentFragment;
  me: Author;
}

export const Footer: FC<Props> = ({ settings, me }) => {
  const { social } = me;
  return (
    <div className="mx-auto mt-28 max-w-[1480px] px-5 sm:px-8">
      <div className="grid gap-12 border-t border-gray-100 pt-20 pb-24 dark:border-gray-900 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-4">
          <div>
            <div className="mb-4">
              <Link href="/" aria-label={settings.site_title}>
                <LogoWithTitle
                  logo={settings.site_logo}
                  title={settings.site_title}
                />
              </Link>
            </div>
            <p>{settings.site_tagline}</p>
          </div>
        </div>
        <div className="hidden lg:col-span-2">
          <h3 className="mb-6 text-sm uppercase tracking-wider">Tags</h3>
          <div>
            <div className="flex flex-wrap gap-3">
              <a
                className="whitespace-nowrap rounded-full border border-black py-1.5 px-2.5 text-xs font-medium uppercase tracking-wide text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
                href="/category/mind"
              >
                mind
              </a>
            </div>
          </div>
        </div>
        <div className="">
          <h3 className="mb-6 text-sm uppercase tracking-wider">follow us</h3>
          <div className="heading-color flex gap-5 text-xl ">
            {settings.site_email && (
              <SocialIcon
                kind="mail"
                href={`mailto:${settings.site_email}`}
                size={6}
              />
            )}
            {social?.github && (
              <SocialIcon kind="github" href={social?.github} size={6} />
            )}
            {social?.facebook && (
              <SocialIcon kind="facebook" href={social?.facebook} size={6} />
            )}
            {social?.linkedin && (
              <SocialIcon kind="linkedin" href={social?.linkedin} size={6} />
            )}
            {social?.twitter && (
              <SocialIcon kind="twitter" href={social?.twitter} size={6} />
            )}
          </div>
        </div>
      </div>
      <div className="py-6 text-center text-sm uppercase tracking-wide">
        © 2023. All rights reserved. Letterpad.
      </div>
    </div>
  );
};
