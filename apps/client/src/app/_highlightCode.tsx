'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const HighlightCode = () => {
  const path = usePathname();
  useEffect(() => {
    if ('Prism' in window) window.Prism.highlightAll();
  }, [path]);
  return null;
};
