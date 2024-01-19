'use client';
import { useEffect } from 'react';
export const SessionCleaner = () => {
  useEffect(() => {
    fetch(`/api/client/session`, {
      headers: {
        siteurl: document.location.origin,
      },
    });
  }, []);
  return null;
};
