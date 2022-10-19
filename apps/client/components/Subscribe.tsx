import { useState } from 'react';

const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const doSubscribe = async () => {
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
    <div id="subscribe" className="flex ">
      <div className="w-full text-center">
        <div className="md:items-left flex max-w-xl  flex-col items-center  p-1 pr-0 text-left ">
          <span className="mb-2 hidden text-gray-500 md:block">Subscribe to my newsletter</span>
          <div>
            <input
              type="email"
              placeholder="yourmail@example.com"
              className="flex-1 border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-900 dark:bg-gray-200 dark:text-black  dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 md:w-64"
              onChange={(e) => setEmail(e.target.value.trim())}
              value={email}
            />
            <button className="button-primary" onClick={doSubscribe}>
              Subscribe
            </button>
          </div>
        </div>
        <small>{error || success}</small>
      </div>
      {/* <div className="">
        <div className="md:flex">
          <div className="flex w-full flex-row items-center p-3">
            <h2 className="mb-4 text-center font-semibold">Subscribe!</h2>
            <div className="relative">
              <input
                type="text"
                className="h-14 w-full rounded-md bg-white px-4 pr-20 hover:cursor-pointer focus:outline-none dark:bg-neutral-800"
                placeholder="Enter your email id"
                name=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={doSubscribe}
                className="absolute top-2 right-2 h-10 rounded bg-black px-3 text-sm text-white hover:bg-gray-900 dark:bg-slate-900 "
              >
                Subscribe Now
              </button>
            </div>
            <small>{error || success}</small>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Subscribe;
