'use client';
import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from 'ui';

import { useSession } from '../../context/SessionProvider';

export const SubscribeToMyBlogPopup = () => {
  const endRef = useRef(null);
  const { hasLoaded } = useIntersectionObserver(endRef, {});
  const { showSubscribe, user } = useSession();

  useEffect(() => {
    if (hasLoaded && !user?.name) {
      showSubscribe(true);
    }
  }, [hasLoaded, showSubscribe, user?.name]);

  return <div ref={endRef}></div>;
};
