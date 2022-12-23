import SocialIcon from '@/components/social-icons';

import Link from './Link';
import { LogoWithTitle } from './Logo';
import Subscribe from './Subscribe';

export default function Footer({ author, settings }) {
  const { social } = author;
  return (
    <footer className="mx-auto max-w-7xl border-t border-gray-200 border-opacity-60 px-8 dark:border-gray-700 md:px-20">
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <LogoWithTitle logo={settings.site_logo} title={settings.site_title} />

        <Subscribe />
      </div>
      <div className="py-8 text-center md:max-w-sm md:text-left">
        <div
          dangerouslySetInnerHTML={{ __html: settings.site_footer }}
          className="w-full text-gray-500 dark:text-gray-500"
        ></div>
      </div>
      <div className="mt-4 flex w-full flex-col items-center justify-between border-t border-gray-200 border-opacity-60 py-6 dark:border-gray-700  md:mt-4 md:flex-row">
        <div className="flex flex-col items-center  sm:mt-0 sm:items-end">
          <div className="mb-3 flex space-x-4">
            {settings.site_email && (
              <SocialIcon
                kind="mail"
                href={`mailto:${settings.site_email}`}
                size={6}
              />
            )}
            {social.github && (
              <SocialIcon kind="github" href={social.github} size={6} />
            )}
            {social.facebook && (
              <SocialIcon kind="facebook" href={social.facebook} size={6} />
            )}
            {social.youtube && (
              <SocialIcon kind="youtube" href={social.youtube} size={6} />
            )}
            {social.linkedin && (
              <SocialIcon kind="linkedin" href={social.linkedin} size={6} />
            )}
            {social.twitter && (
              <SocialIcon kind="twitter" href={social.twitter} size={6} />
            )}
          </div>
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-300">
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <div>
            <Link href="https://letterpad.app" className="link">
              Letterpad
            </Link>
          </div>
          <div>{` • `}</div>
          <div>
            <Link
              href="https://github.com/letterpad/letterpad"
              className="link"
            >
              Open Source
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
