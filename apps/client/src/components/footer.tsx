import Link from '@/components/Link';

import { getApiRootUrl } from '../../lib/utils/url';

export function Footer({ author, settings }) {
  return (
    <footer
      id="site-footer"
      className="mx-auto  border-gray-200 border-opacity-60 dark:border-gray-700"
    >
      <div className="px-2 lg:px-48 space-y-4 lg:space-y-0 flex w-full flex-col items-center justify-between border-t border-gray-200 border-opacity-60 py-6 dark:border-gray-700 lg:flex-row bg-gray-100 dark:bg-gray-800">
        <div className="flex flex-col items-center  sm:mt-0 sm:items-end">
          <span
            dangerouslySetInnerHTML={{
              __html: settings.site_footer,
            }}
            className="w-full text-gray-500 dark:text-gray-300 text-sm md:max-w-96"
          ></span>
        </div>

        <Link
          href={new URL(
            '/register?ref=blog-footer',
            getApiRootUrl()
          ).toString()}
          className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center justify-center gap-2"
        >
          <img
            src={new URL('/logo/logo.png', getApiRootUrl()).toString()}
            width={20}
            alt="Letterpad"
          />
          Publish with Letterpad
        </Link>

        <div className="flex space-x-2 text-sm text-gray-500 dark:text-gray-300">
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <div>
            <Link
              href={new URL(
                `/@${author.username}?ref=blog-footer`,
                getApiRootUrl()
              ).toString()}
              className="underline"
            >
              {author.name}'s Blog
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
