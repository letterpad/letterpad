import { useState } from 'react';

const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const doSubscribe = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <div id="subscribe" className="flex ">
      <div className="w-full text-center">
        <div className="md:items-left flex max-w-xl  flex-col items-center  p-1 pr-0 text-left ">
          <span className="mb-2 hidden text-gray-600 dark:text-gray-300 md:block">
            Subscribe to my newsletter
          </span>
          <div>
            <input
              type="email"
              placeholder="yourmail@example.com"
              className="flex-1 rounded-l-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-900 dark:bg-gray-900  dark:text-gray-200 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 md:w-64"
              onChange={(e) => setEmail(e.target.value.trim())}
              value={email}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  doSubscribe();
                }
              }}
            />
            <button
              className="button-primary bg-accent-50 text-white hover:bg-accent-50 hover:opacity-80"
              onClick={doSubscribe}
              disabled={loading}
            >
              Subscribe
            </button>
          </div>
        </div>
        <small>{error || success}</small>
      </div>
    </div>
  );
};

export default Subscribe;
