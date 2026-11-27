'use client';
import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from 'ui/dist/index.mjs';

import { useSession } from '../../context/SessionProvider';

const SUBSCRIBE_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export const SubscribeToMyBlogPopup = () => {
  const endRef = useRef(null);
  const { hasLoaded } = useIntersectionObserver(endRef, {});
  const { showSubscribe, user, sessionChecked } = useSession();

  useEffect(() => {
    if (!hasLoaded || !sessionChecked || user) return;

    const key = `letterpad-subscribe-last-shown:${window.location.hostname}`;
    try {
      const lastShown = Number(window.localStorage.getItem(key) || 0);
      if (Date.now() - lastShown < SUBSCRIBE_COOLDOWN_MS) return;
      window.localStorage.setItem(key, String(Date.now()));
    } catch {
      // If storage is unavailable, still show the prompt for this visit.
    }
    showSubscribe(true);
  }, [hasLoaded, sessionChecked, showSubscribe, user]);

  return <div ref={endRef}></div>;
};
