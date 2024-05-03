'use client';
import Link from 'next/link';

import { getApiRootUrl } from '../../lib/utils/url';

export const PublishWithLetterpad = () => {
  return (
    <Link
      href={new URL('/register?ref=blog-footer', getApiRootUrl()).toString()}
      className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center justify-center gap-2"
      onClick={() => {
        window?.dataLayer.push({
          event: 'GAEvent',
          eventAction: 'click',
          eventCategory: 'Registration',
          eventLabel: 'footer-register-link',
        });
      }}
    >
      <img
        src={new URL('/logo/logo.png', getApiRootUrl()).toString()}
        width={20}
        alt="Letterpad"
      />
      Publish with Letterpad
    </Link>
  );
};
