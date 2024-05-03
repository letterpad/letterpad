import Link from '@/components/Link';

import { PublishWithLetterpad } from './publishWithLetterpad';
import { getApiRootUrl } from '../../lib/utils/url';

export function Footer({ author, settings }) {
  return (
    <footer
      id="site-footer"
      className="mx-auto  border-gray-200 border-opacity-60 dark:border-gray-700"
    >
      <div className="px-2 lg:px-48 space-y-4 lg:space-y-0 flex w-full flex-col items-center justify-between border-t border-gray-200 border-opacity-60 py-6 dark:border-gray-700 lg:flex-row bg-gray-100 dark:bg-gray-800">
        <div className="flex flex-col items-center  sm:mt-0 sm:items-end flex-1">
          <span
            dangerouslySetInnerHTML={{
              __html: settings.site_footer,
            }}
            className="w-full text-gray-500 dark:text-gray-300 text-sm md:max-w-96"
          ></span>
        </div>

        <PublishWithLetterpad />
        <div className="flex space-x-2 text-sm text-gray-500 dark:text-gray-300 justify-end flex-1">
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
