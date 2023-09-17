import { Button } from 'ui';

export default function Custom404() {
  return (
    <section className="w-full ">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-6xl font-extrabold tracking-tight  lg:text-7xl">
            404
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
            The page is missing.
          </p>
          <p className="mb-4 text-md font-light text-gray-500 dark:text-gray-400">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.{' '}
          </p>
          <a
            href="/"
            className="hover:bg-accent-800 my-4 inline-flex rounded-lg bg-accent-50 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-accent-50 dark:focus:ring-accent-50"
          >
            Back to Homepage
          </a>
        </div>
      </div>
    </section>
  );
}
