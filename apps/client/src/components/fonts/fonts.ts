import localFont from 'next/font/local';

const paragraph = localFont({
  src: '../../../../../packages/config/fonts/dm-sans.woff2',
  variable: '--font-paragraph',
  weight: '100 1000',
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

const heading = localFont({
  src: '../../../../../packages/config/fonts/outfit.woff2',
  variable: '--font-heading',
  weight: '100 900',
  display: 'swap',
  fallback: ['sans-serif'],
  adjustFontFallback: false,
  preload: false,
});

const sans = localFont({
  src: '../../../../../packages/config/fonts/nunito.woff2',
  variable: '--font-sans',
  weight: '200 1000',
  display: 'swap',
  fallback: ['sans-serif'],
  adjustFontFallback: false,
  preload: false,
});

export const fonts = { paragraph, code, heading, sans };
