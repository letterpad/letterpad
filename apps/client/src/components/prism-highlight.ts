'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const PrismHighlight = () => {
  const path = usePathname();

  useEffect(() => {
    //@ts-ignore
    if (typeof window.Prism !== 'undefined') {
      //@ts-ignore
      window.Prism.highlightAll();
    }
  }, [path]);

  return null;
};
