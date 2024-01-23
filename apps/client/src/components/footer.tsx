import Link from '@/components/Link';

import { LogoOrTitle } from './site-logo';
import { SocialIcons } from './social-icons';
import { Subscribe } from './subscribe';

export function Footer({ author, settings }) {
  return (
    <footer className="mx-auto max-w-7xl border-t border-gray-200 border-opacity-60 px-8 dark:border-gray-700 md:px-20">
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        {/* <LogoOrTitle logo={settings.site_logo} title={settings.site_title} /> */}
        <Subscribe />
      </div>
      <div className="py-8 text-center">
        <span
          dangerouslySetInnerHTML={{ __html: settings.site_footer }}
          className="w-full text-gray-500 dark:text-gray-300"
        ></span>
      </div>
      <div className="mt-4 flex w-full flex-col items-center justify-between border-t border-gray-200 border-opacity-60 py-6 dark:border-gray-700  md:mt-4 md:flex-row">
        <div className="flex flex-col items-center  sm:mt-0 sm:items-end">
          <div className="mb-3 flex space-x-4">
            <SocialIcons me={author} />
          </div>
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-300">
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <div>
            <Link href="https://letterpad.app" className="hover:text-accent-50">
              Letterpad
            </Link>
          </div>
          <div>{` • `}</div>
          <div>
            <Link
              href="https://github.com/letterpad/letterpad"
              className="hover:text-accent-50"
            >
              Open Source
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
