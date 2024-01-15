'use client';

import { getApiRootUrl } from 'lib/utils/url';

export const Logout = () => {
  const onClick = () => {
    document.location.href = `${getApiRootUrl()}/api/identity/logout?callbackUrl=${
      document.location.href
    }`;
  };
  return <button onClick={onClick}>Logout</button>;
};
