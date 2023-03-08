import classNames from 'classnames';

import styles from './btn.module.css';

export const Subscribe = () => {
  return (
    <div className="mx-auto mt-36 max-w-[1480px] items-center px-5 text-center sm:px-8 lg:flex  lg:gap-20 lg:text-left xl:gap-36">
      <div className="mb-12 flex-grow lg:mb-0">
        <h2 className="mb-4 text-4xl font-bold">Subscribe to our newsletter</h2>
        <p className=" mb-8">
          Get all the latest posts delivered straight to your inbox.{' '}
        </p>
      </div>
      <div>
        <form className="mx-auto flex max-w-[500px] flex-wrap gap-y-4 gap-x-2 bg-transparent sm:flex-nowrap sm:gap-x-0 sm:rounded-full sm:bg-gray-100 sm:dark:bg-white/10 lg:min-w-[450px]">
          <label className="sr-only" htmlFor="email">
            email
          </label>
          <input
            className="flex-basis-[300px] no-outline h-16 w-full flex-grow rounded-full border-none bg-gray-100 px-6 dark:bg-white/10 sm:bg-transparent sm:dark:bg-transparent"
            id="email"
            name="email"
            placeholder="Your email address"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            type="email"
            required
          />
          <button
            className={classNames(
              'btn relative inline-block h-16 flex-grow rounded-full capitalize sm:flex-grow-0',
              styles.btn
            )}
            type="submit"
          >
            <span className="">Subscribe</span>
          </button>
        </form>
      </div>
    </div>
  );
};
