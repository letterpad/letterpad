import localFont from 'next/font/local';

const geist = localFont({
  src: '../../../../../packages/config/fonts/geist.woff2',
  variable: '--font-paragraph',
  weight: '100 900',
  display: 'swap',
  fallback: ['sans-serif'],
  adjustFontFallback: false,
  preload: false,
});

const code = localFont({
  src: '../../../../../packages/config/fonts/roboto-mono.woff2',
  variable: '--font-code',
  weight: '100 700',
  display: 'swap',
  fallback: ['monospace'],
  adjustFontFallback: false,
  preload: false,
});

const literata = localFont({
  src: '../../../../../packages/config/fonts/literata.woff2',
  variable: '--font-heading',
  weight: '200 900',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: false,
  preload: false,
});

export const fonts = { paragraph: geist, code, heading: literata };
