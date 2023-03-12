import classNames from 'classnames';
import { useState } from 'react';

import styles from './btn.module.css';

export const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const doSubscribe = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (email.length === 0) {
      return setError('Please enter your email');
    }
    const resp = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ variables: { email } }),
    });
    const a = await resp.json();
    if (!a.data.addSubscriber.ok) {
      setError(a.data.addSubscriber.message);
    } else {
      setSuccess('');
      setEmail('');
      setSuccess(a.data.addSubscriber.message);
    }
  };

  return (
    <div className="mx-auto mt-36 max-w-[1480px] items-center px-5 text-center sm:px-8 lg:flex  lg:gap-20 lg:text-left xl:gap-36">
      <div className="mb-12 flex-grow lg:mb-0">
        <h2 className="mb-4 text-4xl font-bold">Subscribe to our newsletter</h2>
        <p className=" mb-8">
          Get all the latest posts delivered straight to your inbox.{' '}
        </p>
      </div>
      <div>
        <form
          className="mx-auto flex max-w-[500px] flex-wrap gap-y-4 gap-x-2 bg-transparent sm:flex-nowrap sm:gap-x-0 sm:rounded-full sm:bg-gray-100 sm:dark:bg-white/10 lg:min-w-[450px]"
          onSubmit={doSubscribe}
        >
          <label className="sr-only" htmlFor="email">
            email
          </label>
          <input
            className="flex-basis-[300px] no-outline h-16 w-full flex-grow rounded-full border-none bg-gray-100 px-6 focus:ring-0 focus:ring-offset-0 dark:bg-white/10 sm:bg-transparent sm:dark:bg-transparent"
            id="email"
            name="email"
            placeholder="Your email address"
            autoComplete="false"
            autoCapitalize="false"
            spellCheck="false"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
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
        <div className="mx-auto max-w-md p-2 text-sm">{error || success}</div>
      </div>
    </div>
  );
};
