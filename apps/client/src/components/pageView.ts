'use client';

import { FC, useEffect } from 'react';

interface Props {
  type: string;
  id: number | string;
}
export const PageView: FC<Props> = (props) => {
  useEffect(() => {
    const url = new URL('/api/events/pageview', window.location.href);
    const params = new URLSearchParams(
      props as unknown as Record<string, string>
    );
    url.search = params.toString();
    fetch(url.href);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
