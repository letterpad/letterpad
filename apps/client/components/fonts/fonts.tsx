'use client';
import { useEffect } from 'react';
import { generateGoogleFontsLink } from './fontsCssLink';

const Fonts = ({ fonts }) => {
  useEffect(() => {
    loadFonts(fonts);
  }, []);

  return null;
};

export default Fonts;

const loadFonts = (fonts: string[]) => {
  const link = document.createElement('link');
  link.href = generateGoogleFontsLink(fonts);
  link.rel = 'stylesheet';

  document.head.appendChild(link);
};
